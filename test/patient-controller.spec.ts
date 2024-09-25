import { Test, TestingModule } from '@nestjs/testing';
import { PatientUseCase } from 'src/core/application/use-cases/patient/patient.use-case';
import { Patient } from 'src/core/domain/entities/patient.model';
import { PatientDTO } from 'src/adapter/driver/dtos/patient.dto';
import { NotFoundException } from '@nestjs/common';
import { PatientController } from 'src/adapter/driver/controllers/patient/patient.controller';

const mockPatientUseCase = (): jest.Mocked<PatientUseCase> => ({
  getAllPatients: jest.fn(),
  getPatientById: jest.fn(),
  createPatient: jest.fn(),
  terminatePatient: jest.fn(),
} as unknown as jest.Mocked<PatientUseCase>);

describe('PatientController', () => {
  let patientController: PatientController;
  let patientUseCase: jest.Mocked<PatientUseCase>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientController],
      providers: [
        { provide: PatientUseCase, useValue: mockPatientUseCase() },
      ],
    }).compile();

    patientController = module.get<PatientController>(PatientController);
    patientUseCase = module.get<jest.Mocked<PatientUseCase>>(PatientUseCase);
  });

  it('should be defined', () => {
    expect(patientController).toBeDefined();
  });

  describe('getAllPatients', () => {
    it('should return an array of patients', async () => {
      const patients: Patient[] = [
        { id: '1', name: 'Patient 1', email: 'patient1@example.com' } as unknown as Patient,
        { id: '2', name: 'Patient 2', email: 'patient2@example.com' } as unknown as Patient,
      ];

      patientUseCase.getAllPatients.mockResolvedValue(patients);

      const result = await patientController.getAllPatients();

      expect(result).toEqual(patients);
      expect(patientUseCase.getAllPatients).toHaveBeenCalled();
    });
  });

  describe('createPatient', () => {
    it('should create a new patient and return the patient object', async () => {
      const patientDTO: PatientDTO = {
        name: 'Patient 1', email: 'patient1@example.com',
        cpf: '',
        password: ''
      };
      const createdPatient: Patient = { id: '1', ...patientDTO } as unknown as Patient;

      patientUseCase.createPatient.mockResolvedValue(createdPatient);

      const result = await patientController.createPatient(patientDTO);

      expect(result).toEqual(createdPatient);
      expect(patientUseCase.createPatient).toHaveBeenCalledWith(patientDTO);
    });
  });

  describe('getPatientById', () => {
    it('should return the patient with the specified ID', async () => {
      const patient = { id: '1', name: 'Patient 1', email: 'patient1@example.com' } as unknown as Patient;
      patientUseCase.getPatientById.mockResolvedValue(patient);

      const result = await patientController.getPatientById('1');

      expect(result).toEqual(patient);
      expect(patientUseCase.getPatientById).toHaveBeenCalledWith('1');
    });

    it('should throw a NotFoundException if the patient is not found', async () => {
      patientUseCase.getPatientById.mockResolvedValue(null);

      try {
        await patientController.getPatientById('999');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }

      expect(patientUseCase.getPatientById).toHaveBeenCalledWith('999');
    });
  });

  describe('terminatePatient', () => {
    it('should terminate the patient with the specified ID', async () => {
      const patientId = '1';

      await patientController.terminatePatient(patientId);

      expect(patientUseCase.terminatePatient).toHaveBeenCalledWith(patientId);
    });

    it('should throw a NotFoundException if the patient to terminate is not found', async () => {
      patientUseCase.getPatientById.mockResolvedValue(null);
      const patientId = '999';

      try {
        await patientController.terminatePatient(patientId);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }

      expect(patientUseCase.terminatePatient).toHaveBeenCalledWith(patientId);
    });
  });
});
