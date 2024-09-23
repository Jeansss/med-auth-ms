import { CustomerFactoryService } from "src/use-cases/patient/customer-factory.service";
import { CustomerUseCases } from "src/core/application/use-cases/patient/patient.use-case";
import { Test, TestingModule } from '@nestjs/testing';
import { IDataServices } from "src/core/domain/repositories/data-services.abstract";
import { Customer } from "src/frameworks/data-services/mongo/entities/customer.model";
import { BadRequestException, NotFoundException } from "@nestjs/common";
import { CustomerDTO } from "src/dto/customer.dto";
import { CustomerRepositoryImpl } from "src/frameworks/data-services/mongo/gateways/customer.repository";



const mockDataServices = () => ({
  customers: {
    getAll: jest.fn(),
    get: jest.fn(),
    getCustomerByCPF: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
});

const mockCustomerFactoryService = () => ({
  createNewCustomer: jest.fn(),
  updateCustomer: jest.fn(),
});


describe('CustomerUseCases', () => {
  let customerUseCases: CustomerUseCases;
  let dataServices;
  let customerFactoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerUseCases,
        { provide: IDataServices, useFactory: mockDataServices },
        { provide: CustomerFactoryService, useFactory: mockCustomerFactoryService },
      ],
    }).compile();

    customerUseCases = module.get<CustomerUseCases>(CustomerUseCases);
    dataServices = module.get<IDataServices<CustomerRepositoryImpl>>(IDataServices);
    customerFactoryService = module.get<CustomerFactoryService>(CustomerFactoryService);
  });

  it('should be defined', () => {
    expect(customerUseCases).toBeDefined();
  });

  describe('getAllCustomers', () => {
    it('should return an array of customers', async () => {
      const customers = [{ name: 'Fiap Customer' } as Customer, { name: 'Mc Customer' } as Customer];
      dataServices.customers.getAll.mockResolvedValue(customers);

      const result = await customerUseCases.getAllCustomers();
      expect(result).toEqual(customers);
      expect(dataServices.customers.getAll).toHaveBeenCalled();
    });
  });

  describe('getCustomerById', () => {
    it('should return a customer when found', async () => {
      const customerId = '123456789012345678901234';
      const customer = { _id: customerId, name: 'John Doe' } as unknown as Customer;
      dataServices.customers.get.mockResolvedValue(customer);

      const result = await customerUseCases.getCustomerById(customerId);
      expect(result).toEqual(customer);
      expect(dataServices.customers.get).toHaveBeenCalledWith(customerId);
    });

    it('should throw NotFoundException when customer is not found', async () => {
      const customerId = '123456789012345678901234';
      dataServices.customers.get.mockResolvedValue(null);
    
      try {
        await customerUseCases.getCustomerById(customerId);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe(`Customer with id: ${customerId} not found at database.`);
      }
    });

    it('should throw BadRequestException for invalid id format', async () => {
      const invalidId = 'invalid-id';
      dataServices.customers.get.mockResolvedValue(BadRequestException);

      try {
        await customerUseCases.getCustomerById(invalidId);
      } catch (e) {
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.message).toBe(`'${invalidId}' is not a valid ObjectID`);
      }
    });
  });

  describe('getCustomerByCPF', () => {
    it('should return a customer when found by CPF', async () => {
      const customerCPF = '12345678900';
      const customer = { cpf: customerCPF, name: 'John Doe' } as Customer;
      dataServices.customers.getCustomerByCPF.mockResolvedValue(customer);

      const result = await customerUseCases.getCustomerByCPF(customerCPF);
      expect(result).toEqual(customer);
      expect(dataServices.customers.getCustomerByCPF).toHaveBeenCalledWith(customerCPF);
    });

    it('should throw NotFoundException when customer is not found by CPF', async () => {
      const customerCPF = '12345678900';
      dataServices.customers.getCustomerByCPF.mockResolvedValue(null);

      try {
        await customerUseCases.getCustomerByCPF(customerCPF);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe(`Customer with id: ${customerCPF} not found at database.`);
      }
    });
  });

  describe('createCustomer', () => {
    it('should create and return a new customer', async () => {
      const customerDTO: CustomerDTO = { name: 'John Doe', cpf: '12345678900', email: 'test@test.com'};
      const customer = { _id: '123', ...customerDTO } as Customer;
      customerFactoryService.createNewCustomer.mockReturnValue(customer);
      dataServices.customers.create.mockResolvedValue(customer);

      const result = await customerUseCases.createCustomer(customerDTO);
      expect(result).toEqual(customer);
      expect(customerFactoryService.createNewCustomer).toHaveBeenCalledWith(customerDTO);
      expect(dataServices.customers.create).toHaveBeenCalledWith(customer);
    });
  });

  describe('updateCustomer', () => {
    it('should update and return the customer', async () => {
      const customerId = '123';
      const customerDTO: CustomerDTO = { name: 'John Doe', cpf: '12345678900', email: 'test@test.com' };
      const customer = { _id: customerId, ...customerDTO } as Customer;
      customerFactoryService.updateCustomer.mockReturnValue(customer);
      dataServices.customers.update.mockResolvedValue(customer);

      const result = await customerUseCases.updateCustomer(customerId, customerDTO);
      expect(result).toEqual(customer);
      expect(customerFactoryService.updateCustomer).toHaveBeenCalledWith(customerDTO);
      expect(dataServices.customers.update).toHaveBeenCalledWith(customerId, customer);
    });
  });

  describe('delete', () => {
    it('should delete the customer', async () => {
      const customerId = '60af884034d1b9f123456789';
      const customer = { _id: customerId, name: 'John Doe' } as unknown as Customer;
      dataServices.customers.get.mockResolvedValue(customer);
      dataServices.customers.delete.mockResolvedValue(customer);

      await customerUseCases.delete(customerId);
      expect(dataServices.customers.get).toHaveBeenCalledWith(customerId);
      expect(dataServices.customers.delete).toHaveBeenCalledWith(customerId);
    });

    it('should throw NotFoundException when customer is not found for deletion', async () => {
      const customerId = '60af884034d1b9f123456789';
      const customer = { _id: customerId, name: 'John Doe' } as unknown as Customer;
      dataServices.customers.get.mockResolvedValue(null);
      dataServices.customers.delete.mockResolvedValue(customer);

      try {
        await customerUseCases.delete(customerId);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe(`Customer with id: ${customerId} not found at database.`);
        expect(dataServices.customers.get).toHaveBeenCalledWith(customerId);
        expect(dataServices.customers.delete).not.toHaveBeenCalled();
      }
    });
  });
});