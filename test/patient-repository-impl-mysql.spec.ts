import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Patient } from 'src/core/domain/entities/patient.model';
import { PatientRepositoryImpl } from 'src/adapter/driven/repositories/patient.repository';

const mockRepository = () => ({
  find: jest.fn(),
  findOneBy: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('PatientRepositoryImpl', () => {
  let patientRepository: PatientRepositoryImpl;
  let repositoryMock: jest.Mocked<Repository<Patient>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatientRepositoryImpl,
        {
          provide: getRepositoryToken(Patient),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    patientRepository = new PatientRepositoryImpl(module.get(getRepositoryToken(Patient)));
    repositoryMock = module.get(getRepositoryToken(Patient));
  });

  it('should be defined', () => {
    expect(patientRepository).toBeDefined();
  });

  describe('getPatientById', () => {
    it('should return the patient with the specified ID', async () => {
      const patient = { id: 1, name: 'Test', email: 'test@test.com', cpf: '22233355566', password: 'testpass123456', status: 'ACTIVE', role: 'patient' } as Patient;
      repositoryMock.findOneBy.mockResolvedValue(patient);

      const result = await patientRepository.get(1);

      expect(result).toEqual(patient);
      expect(repositoryMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return null if the patient with the specified ID does not exist', async () => {
      repositoryMock.findOneBy.mockResolvedValue(null);

      const result = await patientRepository.get(999);

      expect(result).toBeNull();
      expect(repositoryMock.findOneBy).toHaveBeenCalledWith({ id: 999 });
    });
  });

  describe('createPatient', () => {
    it('should create a new patient and return the created patient object', async () => {
      const patient = { id: 1, name: 'Test', email: 'test@test.com', cpf: '22233355566', password: 'testpass123456', status: 'ACTIVE', role: 'patient' } as Patient;
      repositoryMock.save.mockResolvedValue(patient);

      const result = await patientRepository.create(patient);

      expect(result).toEqual(patient);
      expect(repositoryMock.save).toHaveBeenCalledWith(patient);
    });
  });

  describe('getPatientByEmail', () => {
    it('should return the patient with the specified email', async () => {
      const patient = { id: 1, name: 'Test', email: 'test@test.com', cpf: '22233355566', password: 'testpass123456', status: 'ACTIVE', role: 'patient' } as Patient;
      repositoryMock.find.mockResolvedValue([patient]);

      const result = await patientRepository.getPatientByEmail('test@test.com');

      expect(result).toEqual([patient]);
      expect(repositoryMock.find).toHaveBeenCalledWith({
        where: { email: 'test@test.com' },
      });
    });

    it('should return an empty array if no patient is found with the specified email', async () => {
      repositoryMock.find.mockResolvedValue([]);

      const result = await patientRepository.getPatientByEmail('nonexistent@test.com');

      expect(result).toEqual([]);
      expect(repositoryMock.find).toHaveBeenCalledWith({
        where: { email: 'nonexistent@test.com' },
      });
    });
  });
});
