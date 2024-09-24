import { Test, TestingModule } from '@nestjs/testing';
import { IDataServices } from 'src/core/domain/repositories/data-services.abstract';
import { Doctor } from 'src/core/domain/entities/doctor.model';
import { DoctorDTO } from 'src/adapter/driver/dtos/doctor.dto';
import { NotFoundException } from '@nestjs/common';
import { DoctorUseCase } from 'src/core/application/use-cases/doctor/doctor.use-case';
import { DoctorFactoryService } from 'src/core/application/use-cases/doctor/doctor-factory.service';

const mockDataServices = () => ({
  doctors: {
    getAll: jest.fn(),
    get: jest.fn(),
    create: jest.fn(),
    getDoctorByName: jest.fn(),
  },
});

const mockDoctorFactoryService = () => ({
  createNewDoctor: jest.fn(),
});

describe('DoctorUseCase', () => {
  let doctorUseCase: DoctorUseCase;
  let dataServicesMock: ReturnType<typeof mockDataServices>;
  let doctorFactoryServiceMock: ReturnType<typeof mockDoctorFactoryService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DoctorUseCase,
        { provide: IDataServices, useValue: mockDataServices() },
        { provide: DoctorFactoryService, useValue: mockDoctorFactoryService() },
      ],
    }).compile();

    doctorUseCase = module.get<DoctorUseCase>(DoctorUseCase);
    dataServicesMock = module.get(IDataServices);
    doctorFactoryServiceMock = module.get(DoctorFactoryService);
  });

  it('should be defined', () => {
    expect(doctorUseCase).toBeDefined();
  });

  describe('getAllDoctors', () => {
    it('should return all doctors', async () => {
      const doctors: Doctor[] = [
        { id: '1', name: 'Doctor 1', email: 'doctor1@example.com' } as unknown as Doctor,
        { id: '2', name: 'Doctor 2', email: 'doctor2@example.com' } as unknown as Doctor,
      ];
      dataServicesMock.doctors.getAll.mockResolvedValue(doctors);

      const result = await doctorUseCase.getAllDoctors();

      expect(result).toEqual(doctors);
      expect(dataServicesMock.doctors.getAll).toHaveBeenCalled();
    });
  });

  describe('getDoctorById', () => {
    it('should return the doctor with the specified ID', async () => {
      const doctor = { id: '1', name: 'Doctor 1', email: 'doctor1@example.com' } as unknown as Doctor;
      dataServicesMock.doctors.get.mockResolvedValue(doctor);

      const result = await doctorUseCase.getDoctorById('1');

      expect(result).toEqual(doctor);
      expect(dataServicesMock.doctors.get).toHaveBeenCalledWith('1');
    });

    it('should throw a NotFoundException if the doctor with the specified ID does not exist', async () => {
      dataServicesMock.doctors.get.mockResolvedValue(null);

      await expect(doctorUseCase.getDoctorById('999')).rejects.toThrow(NotFoundException);
      expect(dataServicesMock.doctors.get).toHaveBeenCalledWith('999');
    });
  });

  describe('getDoctorByName', () => {
    it('should return the doctor with the specified name', async () => {
      const doctor = { id: '1', name: 'Doctor 1', email: 'doctor1@example.com' } as unknown as Doctor;
      dataServicesMock.doctors.getDoctorByName.mockResolvedValue([doctor]);

      const result = await doctorUseCase.getDoctorByName('Doctor 1');

      expect(result).toEqual(doctor);
      expect(dataServicesMock.doctors.getDoctorByName).toHaveBeenCalledWith('Doctor 1');
    });

    it('should throw a NotFoundException if the doctor with the specified name does not exist', async () => {
      dataServicesMock.doctors.getDoctorByName.mockResolvedValue([]);

      await expect(doctorUseCase.getDoctorByName('Nonexistent Doctor')).rejects.toThrow(NotFoundException);
      expect(dataServicesMock.doctors.getDoctorByName).toHaveBeenCalledWith('Nonexistent Doctor');
    });
  });

  describe('createDoctor', () => {
    it('should create a new doctor and return the created doctor', async () => {
      const doctorDTO: DoctorDTO = {
        name: 'New Doctor', email: 'newdoctor@example.com',
        cpf: '',
        crm: '',
        specialty: '',
        password: ''
      };
      const newDoctor: Doctor = { id: '1', ...doctorDTO } as unknown as Doctor;

      doctorFactoryServiceMock.createNewDoctor.mockResolvedValue(newDoctor);
      dataServicesMock.doctors.create.mockResolvedValue(newDoctor);

      const result = await doctorUseCase.createDoctor(doctorDTO);

      expect(result).toEqual(newDoctor);
      expect(doctorFactoryServiceMock.createNewDoctor).toHaveBeenCalledWith(doctorDTO);
      expect(dataServicesMock.doctors.create).toHaveBeenCalledWith(newDoctor);
    });
  });
});
