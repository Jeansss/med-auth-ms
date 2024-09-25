import { Test, TestingModule } from '@nestjs/testing';
import { IDataServices } from 'src/core/domain/repositories/data-services.abstract';
import { Patient } from 'src/core/domain/entities/patient.model';
import { PatientDTO } from 'src/adapter/driver/dtos/patient.dto';
import { NotFoundException } from '@nestjs/common';
import { PatientUseCase } from 'src/core/application/use-cases/patient/patient.use-case';
import { PatientFactoryService } from 'src/core/application/use-cases/patient/patient-factory.service';
import { PatientStatus } from 'src/core/domain/enums/patient.enum';

const mockDataServices = () => ({
  patients: {
    getAll: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
});

const mockPatientFactoryService = () => ({
  createNewPatient: jest.fn(),
});

describe('PatientUseCase', () => {
  let patientUseCase: PatientUseCase;
  let dataServicesMock: ReturnType<typeof mockDataServices>;
  let patientFactoryServiceMock: ReturnType<typeof mockPatientFactoryService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatientUseCase,
        { provide: IDataServices, useValue: mockDataServices() },
        { provide: PatientFactoryService, useValue: mockPatientFactoryService() },
      ],
    }).compile();

    patientUseCase = module.get<PatientUseCase>(PatientUseCase);
    dataServicesMock = module.get(IDataServices);
    patientFactoryServiceMock = module.get(PatientFactoryService);
  });

  it('should be defined', () => {
    expect(patientUseCase).toBeDefined();
  });

  describe('getAllPatients', () => {
    it('should return all patients', async () => {
      const patients: Patient[] = [
        { id: '1', name: 'Patient 1', email: 'patient1@example.com', status: PatientStatus.ACTIVE } as unknown as Patient,
        { id: '2', name: 'Patient 2', email: 'patient2@example.com', status: PatientStatus.ACTIVE } as unknown as Patient,
      ];
      dataServicesMock.patients.getAll.mockResolvedValue(patients);

      const result = await patientUseCase.getAllPatients();

      expect(result).toEqual(patients);
      expect(dataServicesMock.patients.getAll).toHaveBeenCalled();
    });
  });

  describe('getPatientById', () => {
    it('should return the patient with the specified ID if patient is active', async () => {
      const patient = { id: '1', name: 'Patient 1', email: 'patient1@example.com', status: PatientStatus.ACTIVE } as unknown as Patient;
      dataServicesMock.patients.get.mockResolvedValue(patient);

      const result = await patientUseCase.getPatientById('1');

      expect(result).toEqual(patient);
      expect(dataServicesMock.patients.get).toHaveBeenCalledWith('1');
    });

    it('should throw a NotFoundException if the patient is not active', async () => {
      const inactivePatient = { id: '1', name: 'Patient 1', email: 'patient1@example.com', status: PatientStatus.INACTIVE } as unknown as Patient;
      dataServicesMock.patients.get.mockResolvedValue(inactivePatient);

      await expect(patientUseCase.getPatientById('1')).rejects.toThrow(NotFoundException);
      expect(dataServicesMock.patients.get).toHaveBeenCalledWith('1');
    });

    it('should throw a NotFoundException if the patient does not exist', async () => {
      dataServicesMock.patients.get.mockResolvedValue(null);

      await expect(patientUseCase.getPatientById('999')).rejects.toThrow(NotFoundException);
      expect(dataServicesMock.patients.get).toHaveBeenCalledWith('999');
    });
  });

  describe('createPatient', () => {
    it('should create a new patient and return the created patient', async () => {
      const patientDTO: PatientDTO = {
        name: 'New Patient', email: 'newpatient@example.com',
        cpf: '12345678911',
        password: 'password12223'
      };
      const newPatient: Patient = { id: '1', ...patientDTO, status: PatientStatus.ACTIVE } as unknown as Patient;

      patientFactoryServiceMock.createNewPatient.mockResolvedValue(newPatient);
      dataServicesMock.patients.create.mockResolvedValue(newPatient);

      const result = await patientUseCase.createPatient(patientDTO);

      expect(result).toEqual(newPatient);
      expect(patientFactoryServiceMock.createNewPatient).toHaveBeenCalledWith(patientDTO);
      expect(dataServicesMock.patients.create).toHaveBeenCalledWith(newPatient);
    });
  });

  describe('terminatePatient', () => {
    it('should update the status of the patient to inactive', async () => {
      const activePatient = { id: '1', name: 'Patient 1', email: 'patient1@example.com', status: PatientStatus.ACTIVE } as unknown as Patient;
      const updatedPatient = { ...activePatient, status: PatientStatus.INACTIVE };

      dataServicesMock.patients.get.mockResolvedValue(activePatient);
      dataServicesMock.patients.update.mockResolvedValue(updatedPatient);

      await patientUseCase.terminatePatient('1');

      expect(dataServicesMock.patients.get).toHaveBeenCalledWith('1');
      expect(dataServicesMock.patients.update).toHaveBeenCalledWith('1', updatedPatient);
    });

    it('should throw a NotFoundException if the patient does not exist', async () => {
      dataServicesMock.patients.get.mockResolvedValue(null);

      await expect(patientUseCase.terminatePatient('999')).rejects.toThrow(NotFoundException);
      expect(dataServicesMock.patients.get).toHaveBeenCalledWith('999');
      expect(dataServicesMock.patients.update).not.toHaveBeenCalled();
    });
  });
});
