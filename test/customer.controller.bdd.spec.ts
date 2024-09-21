import { defineFeature, loadFeature } from 'jest-cucumber';
import { Test, TestingModule } from '@nestjs/testing';
import { CustomerUseCases } from 'src/use-cases/patient/patient.use-case';
import { CustomerDTO } from 'src/dto/customer.dto';
import { Customer } from 'src/frameworks/data-services/mongo/entities/customer.model';
import { CustomerController } from 'src/controllers/patient/customer.controller';

const feature = loadFeature('./test/customer.feature');

const mockCustomerUseCases = () => ({
  createCustomer: jest.fn(),
  getAllCustomers: jest.fn(),
  getCustomerById: jest.fn(),
  getCustomerByCPF: jest.fn(),
  updateCustomer: jest.fn(),
  delete: jest.fn(),
});

defineFeature(feature, test => {
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

  test('Create a new customer', ({ given, when, then }) => {
    let customerDTO: CustomerDTO;
    let customer: Customer;

    given('I have a customer', () => {
      customerDTO = { name: 'Fiap Customer', cpf: '19100000000', email: 'fiap.customer@test.com' } as CustomerDTO;
    });

    when('I create the customer', async () => {
      customer = { _id: 'customerId', ...customerDTO } as Customer;
      customerUseCases.createCustomer.mockResolvedValue(customer);
      customer = await customerController.createCustomer(customerDTO);
    });

    then('I should receive the created customer', () => {
      expect(customer).toEqual({ _id: 'customerId', ...customerDTO });
      expect(customerUseCases.createCustomer).toHaveBeenCalledWith(customerDTO);
    });
  });

  test('Get all customers', ({ given, when, then }) => {
    let customers: Customer[];

    given('there are customers in the system', () => {
      customers = [
        { _id: 'customerId1', name: 'Fiap Customer', cpf: '19100000000', email: 'fiap.customer@test.com' } as Customer,
        { _id: 'customerId2', name: 'Jean Customer', cpf: '29100000000', email: 'jean.customer@test.com' } as Customer,
      ];
      customerUseCases.getAllCustomers.mockResolvedValue(customers);
    });

    when('I get all customers', async () => {
      customers = await customerController.getAllCustomers();
    });

    then('I should receive a list of customers', () => {
      expect(customers).toEqual([
        { _id: 'customerId1', name: 'Fiap Customer', cpf: '19100000000', email: 'fiap.customer@test.com' },
        { _id: 'customerId2', name: 'Jean Customer', cpf: '29100000000', email: 'jean.customer@test.com' },
      ]);
      expect(customerUseCases.getAllCustomers).toHaveBeenCalled();
    });
  });
});
