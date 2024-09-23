import { Test, TestingModule } from '@nestjs/testing';
import { CustomerUseCases } from 'src/core/application/use-cases/patient/patient.use-case';
import { CustomerDTO } from 'src/dto/customer.dto';
import { Customer } from 'src/frameworks/data-services/mongo/entities/customer.model';
import { CustomerController } from 'src/controllers/patient/customer.controller';

const mockCustomerUseCases = () => ({
  getAllCustomers: jest.fn(),
  createCustomer: jest.fn(),
  getCustomerById: jest.fn(),
  getCustomerByCPF: jest.fn(),
  updateCustomer: jest.fn(),
  delete: jest.fn(),
});

describe('CustomerController', () => {
  let customerController: CustomerController;
  let customerUseCases;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        { provide: CustomerUseCases, useFactory: mockCustomerUseCases },
      ],
    }).compile();

    customerController = module.get<CustomerController>(CustomerController);
    customerUseCases = module.get<CustomerUseCases>(CustomerUseCases);
  });

  it('should be defined', () => {
    expect(customerController).toBeDefined();
  });

  describe('getAllCustomers', () => {
    it('should return an array of customers', async () => {
      const customers = [{ name: 'Fiap Customer', cpf: '12345678900', email: 'test@test.com' } as Customer];
      customerUseCases.getAllCustomers.mockResolvedValue(customers);

      const result = await customerController.getAllCustomers();
      expect(result).toEqual(customers);
      expect(customerUseCases.getAllCustomers).toHaveBeenCalled();
    });

    it('should return an empty array when no customers are found', async () => {
      const customers = [];
      customerUseCases.getAllCustomers.mockResolvedValue(customers);

      const result = await customerController.getAllCustomers();
      expect(result).toEqual(customers);
      expect(customerUseCases.getAllCustomers).toHaveBeenCalled();
    });
  });

  describe('createCustomer', () => {
    it('should create and return a new customer', async () => {
      const customerDTO: CustomerDTO = { name: 'Fiap Customer', cpf: '12345678900', email: 'test@test.com'};
      const customer = { _id: '123', ...customerDTO } as Customer;
      customerUseCases.createCustomer.mockResolvedValue(customer);

      const result = await customerController.createCustomer(customerDTO);
      expect(result).toEqual(customer);
      expect(customerUseCases.createCustomer).toHaveBeenCalledWith(customerDTO);
    });
  });

  describe('getCustomerById', () => {
    it('should return a customer when found by ID', async () => {
      const customerId = '123456789012345678901234';
      const customer = { _id: customerId, name: 'John Doe' } as unknown as Customer;
      customerUseCases.getCustomerById.mockResolvedValue(customer);

      const result = await customerController.getCustomerById(customerId);
      expect(result).toEqual(customer);
      expect(customerUseCases.getCustomerById).toHaveBeenCalledWith(customerId);
    });

    it('should throw an error when the ID is invalid', async () => {
      const customerId = 'invalid-id';
      customerUseCases.getCustomerById.mockRejectedValue(new Error('Invalid ID'));
      
      try {
        await customerController.getCustomerById(customerId);
      } catch (error) {
        expect(error.message).toEqual('Invalid ID');
      }
    });
  });

  describe('getCustomerByCPF', () => {
    it('should return a customer when found by CPF', async () => {
      const customerCPF = '12345678900';
      const customer = { cpf: customerCPF, name: 'John Doe' } as Customer;
      customerUseCases.getCustomerByCPF.mockResolvedValue(customer);

      const result = await customerController.getCustomerByCPF(customerCPF);
      expect(result).toEqual(customer);
      expect(customerUseCases.getCustomerByCPF).toHaveBeenCalledWith(customerCPF);
    });
  });

  describe('updateCustomer', () => {
    it('should update and return the customer', async () => {
      const customerId = '123';
      const customerDTO: CustomerDTO = { name: 'John Doe', cpf: '12345678900', email: 'test@test.com'};
      const customer = { _id: customerId, ...customerDTO } as Customer;
      customerUseCases.updateCustomer.mockResolvedValue(customer);

      const result = await customerController.updateCustomer(customerId, customerDTO);
      expect(result).toEqual(customer);
      expect(customerUseCases.updateCustomer).toHaveBeenCalledWith(customerId, customerDTO);
    });
  });

  describe('deleteCustomer', () => {
    it('should delete the customer', async () => {
      const customerId = '123';
      customerUseCases.delete.mockResolvedValue(undefined);

      await customerController.deleteCustomer(customerId);

      expect(customerUseCases.delete).toHaveBeenCalledWith(customerId);
    });
  });
});