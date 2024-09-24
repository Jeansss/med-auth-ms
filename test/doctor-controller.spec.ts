import { Test, TestingModule } from '@nestjs/testing';
import { DoctorUseCase } from 'src/core/application/use-cases/doctor/doctor.use-case';
import { Doctor } from 'src/core/domain/entities/doctor.model';
import { DoctorDTO } from 'src/adapter/driver/dtos/doctor.dto';
import { NotFoundException } from '@nestjs/common';
import { DoctorController } from 'src/adapter/driver/controllers/doctor/doctor.controller';

const mockDoctorUseCase = (): jest.Mocked<DoctorUseCase> => ({
  getAllDoctors: jest.fn(),
  getDoctorById: jest.fn(),
  getDoctorByName: jest.fn(),
  createDoctor: jest.fn(),
} as unknown as jest.Mocked<DoctorUseCase>);

describe('DoctorController', () => {
  let doctorController: DoctorController;
  let doctorUseCase: jest.Mocked<DoctorUseCase>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoctorController],
      providers: [
        { provide: DoctorUseCase, useValue: mockDoctorUseCase() },
      ],
    }).compile();

    doctorController = module.get<DoctorController>(DoctorController);
    doctorUseCase = module.get<jest.Mocked<DoctorUseCase>>(DoctorUseCase);
  });

  it('should be defined', () => {
    expect(doctorController).toBeDefined();
  });

  describe('getAllDoctors', () => {
    it('should return an array of doctors', async () => {
      const doctors: Doctor[] = [
        { id: '1', name: 'Doctor 1', email: 'doctor1@example.com' } as unknown as Doctor,
        { id: '2', name: 'Doctor 2', email: 'doctor2@example.com' } as unknown as Doctor,
      ];

      doctorUseCase.getAllDoctors.mockResolvedValue(doctors);

      const result = await doctorController.getAllDoctors();

      expect(result).toEqual(doctors);
      expect(doctorUseCase.getAllDoctors).toHaveBeenCalled();
    });
  });

  describe('createDoctor', () => {
    it('should create a new doctor and return the doctor object', async () => {
      const doctorDTO: DoctorDTO = {
        name: 'Doctor 1', email: 'doctor1@example.com', specialty: 'Cardiology', crm: '12345',
        cpf: '',
        password: ''
      };
      const createdDoctor: Doctor = { id: '1', ...doctorDTO } as unknown as Doctor;

      doctorUseCase.createDoctor.mockResolvedValue(createdDoctor);

      const result = await doctorController.createDoctor(doctorDTO);

      expect(result).toEqual(createdDoctor);
      expect(doctorUseCase.createDoctor).toHaveBeenCalledWith(doctorDTO);
    });
  });

  describe('getDoctorById', () => {
    it('should return the doctor with the specified ID', async () => {
      const doctor = { id: '1', name: 'Doctor 1', email: 'doctor1@example.com' } as unknown as Doctor;
      doctorUseCase.getDoctorById.mockResolvedValue(doctor);

      const result = await doctorController.getDoctorById('1');

      expect(result).toEqual(doctor);
      expect(doctorUseCase.getDoctorById).toHaveBeenCalledWith('1');
    });

    it('should throw a NotFoundException if the doctor is not found', async () => {
      doctorUseCase.getDoctorById.mockResolvedValue(null);

      try {
        await doctorController.getDoctorById('999');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }

      expect(doctorUseCase.getDoctorById).toHaveBeenCalledWith('999');
    });
  });

  describe('getDoctorByName', () => {
    it('should return the doctor with the specified name', async () => {
      const doctor = { id: '1', name: 'Doctor 1', email: 'doctor1@example.com' } as unknown as Doctor;
      doctorUseCase.getDoctorByName.mockResolvedValue(doctor);

      const result = await doctorController.getDoctorByName('Doctor 1');

      expect(result).toEqual(doctor);
      expect(doctorUseCase.getDoctorByName).toHaveBeenCalledWith('Doctor 1');
    });

    it('should throw a NotFoundException if the doctor with the specified name is not found', async () => {
      doctorUseCase.getDoctorByName.mockResolvedValue(null);

      try {
        await doctorController.getDoctorByName('Unknown Doctor');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }

      expect(doctorUseCase.getDoctorByName).toHaveBeenCalledWith('Unknown Doctor');
    });
  });
});
