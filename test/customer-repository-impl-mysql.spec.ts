
import { Customer } from 'src/frameworks/data-services/mysql/entities/customer.model';
import { CustomerRepositoryImpl } from 'src/frameworks/data-services/mysql/gateways/customer.repository';

// Mock do modelo Customer
const mockCustomerModel = () => ({
  find: jest.fn(),
  findOneBy: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn()
});

describe('CustomerRepositoryImpl', () => {
  let repository: CustomerRepositoryImpl;
  let customerModel: ReturnType<typeof mockCustomerModel>;

  beforeEach(async () => {
    customerModel = mockCustomerModel() as any;

    repository = new CustomerRepositoryImpl(customerModel as any);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an array of customers', async () => {
      const customers = [{ name: 'Fiap Customer' } as Customer, { name: 'Mc Customer' } as Customer];
      customerModel.find.mockResolvedValue(customers);

      const result = await repository.getAll();
      expect(result).toEqual(customers);
      expect(customerModel.find).toHaveBeenCalled();
    });

    it('should return an empty array when no customers are found', async () => {
      const customers = [];
      customerModel.find.mockResolvedValue(customers);

      const result = await repository.getAll();
      expect(result).toEqual(customers);
      expect(customerModel.find).toHaveBeenCalled();
    });
  });

  describe('getCustomerByCPF', () => {
    it('should return a customer when found', async () => {
      const customerCPF = '12345678900';
      const customer = { cpf: customerCPF, name: 'Fiap Customer' } as Customer;
      customerModel.find.mockResolvedValue([customer]);

      const result = await repository.getCustomerByCPF(customerCPF);
      expect(result).toEqual([customer]);
      expect(customerModel.find).toHaveBeenCalledWith({
        where: {
          cpf: customerCPF
        }
      });
    });

    it('should return an empty array when no customer is found', async () => {
      const customerCPF = '12345678900';
      customerModel.find.mockResolvedValue([]);

      const result = await repository.getCustomerByCPF(customerCPF);
      expect(result).toEqual([]);
      expect(customerModel.find).toHaveBeenCalledWith({
        where: {
          cpf: customerCPF
        }
      });
    });

    it('should return a customer when found by id', async () => {
      const id = '6693e579b37b27a17a14b5fe';
      const customer = { _id: id, name: 'Fiap Customer' } as unknown as Customer;
      customerModel.findOneBy.mockResolvedValue(customer);

      const result = await repository.get(id);
      expect(result).toEqual(customer);
      expect(customerModel.findOneBy).toHaveBeenCalledWith({ id });
    });

    it('should return null when no customer is found by id', async () => {
      const id = '6693e579b37b27a17a14b5f7';
      customerModel.findOneBy.mockReturnValue(null);

      const result = await repository.get(id);
      expect(result).toEqual(null);
      expect(customerModel.findOneBy).toHaveBeenCalledWith({ id });
    });


    it('should return a customer when created', async () => {
      const customer = { name: 'Fiap Customer', cpf: '12345678900' } as Customer;
      customerModel.save.mockResolvedValue(customer);

      const result = await repository.create(customer);
      expect(result).toEqual(customer);
      expect(customerModel.save).toHaveBeenCalledWith(customer);
    });

    it('should return a customer when updated', async () => {
      const id = '12345678900';
      const customer = { id: id, name: 'Fiap Customer' } as unknown as Customer;
      customerModel.update.mockReturnValueOnce({
        then: jest.fn().mockResolvedValue(customer)
      });

      const result = await repository.update(id, customer);
      expect(result).toEqual(customer);
      expect(customerModel.update).toHaveBeenCalledWith({ id }, customer);
    });

    it('should delete a customer', async () => {
      const customerId = '12345678900';
      customerModel.delete.mockReturnValue({});

      await repository.delete(customerId);

      expect(customerModel.delete).toHaveBeenCalledWith(customerId);
    });
  });
});
