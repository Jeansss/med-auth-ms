
import { Customer } from 'src/frameworks/data-services/mongo/entities/customer.model';
import { CustomerRepositoryImpl } from 'src/frameworks/data-services/mongo/gateways/customer.repository';

// Mock do modelo Customer
const mockCustomerModel = () => ({
  find: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
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
      customerModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(customers),
      });

      const result = await repository.getAll();
      expect(result).toEqual(customers);
      expect(customerModel.find).toHaveBeenCalled();
    });

    it('should return an empty array when no customers are found', async () => {
      const customers = [];
      customerModel.find.mockReturnValue({
        populate: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(customers),
      });

      const result = await repository.getAll();
      expect(result).toEqual(customers);
      expect(customerModel.find).toHaveBeenCalled();
    });
  });

  describe('getCustomerByCPF', () => {
    it('should return a customer when found', async () => {
      const customerCPF = '12345678900';
      const customer = { cpf: customerCPF, name: 'Fiap Customer' } as Customer;
      customerModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([customer]),
      });

      const result = await repository.getCustomerByCPF(customerCPF);
      expect(result).toEqual([customer]);
      expect(customerModel.find).toHaveBeenCalledWith({ cpf: customerCPF });
    });

    it('should return an empty array when no customer is found', async () => {
      const customerCPF = '12345678900';
      customerModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      });

      const result = await repository.getCustomerByCPF(customerCPF);
      expect(result).toEqual([]);
      expect(customerModel.find).toHaveBeenCalledWith({ cpf: customerCPF });
    });

    it('should return a customer when found by id', async () => {
      const customerId = '6693e579b37b27a17a14b5fe';
      const customer = { _id: customerId, name: 'Fiap Customer' } as unknown as Customer;
      customerModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(customer),
      });

      const result = await repository.get(customerId);
      expect(result).toEqual(customer);
      expect(customerModel.findById).toHaveBeenCalledWith(customerId);
    });

    it('should return null when no customer is found by id', async () => {
      const customerId = '6693e579b37b27a17a14b5fe';
      customerModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      const result = await repository.get(customerId);
      expect(result).toEqual(null);
      expect(customerModel.findById).toHaveBeenCalledWith(customerId);
    });


    it('should return a customer when created', async () => {
      const customer = { name: 'Fiap Customer', cpf: '12345678900' } as Customer;
      customerModel.create.mockResolvedValue(customer);

      const result = await repository.create(customer);
      expect(result).toEqual(customer);
      expect(customerModel.create).toHaveBeenCalledWith(customer);
    });

    it('should return a customer when updated', async () => {
      const customerId = '12345678900';
      const customer = { _id: customerId, name: 'Fiap Customer' } as unknown as Customer;
      customerModel.findByIdAndUpdate.mockResolvedValue(customer);

      const result = await repository.update(customerId, customer);
      expect(result).toEqual(customer);
      expect(customerModel.findByIdAndUpdate).toHaveBeenCalledWith(customerId, customer, { new: true });
    });

    it('should delete a customer', async () => {
      const customerId = '12345678900';
      customerModel.findByIdAndDelete.mockReturnValue({
        exec: jest.fn().mockResolvedValue({}),
      });
    
      await repository.delete(customerId);
    
      expect(customerModel.findByIdAndDelete).toHaveBeenCalledWith(customerId);
    });
  });
});
