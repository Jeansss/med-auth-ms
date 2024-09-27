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
    getDoctorBySpecialty: jest.fn(),
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

  describe('getDoctoBySpecialty', () => {
    it('should return all doctors with the specified specialty', async () => {
      const doctors: Doctor[] = [
        { id: '1', name: 'Doctor 1', email: '', specialty: 'Cardiologia' } as unknown as Doctor,
        { id: '2', name: 'Doctor 2', email: '', specialty: 'Oncologia' } as unknown as Doctor,
      ];
      dataServicesMock.doctors.getDoctorBySpecialty.mockResolvedValue(doctors);

      const result = await doctorUseCase.getDoctorBySpecialty('Cardiologia');
      
      expect(result).toEqual(doctors);
      expect(dataServicesMock.doctors.getDoctorBySpecialty).toHaveBeenCalledWith('Cardiologia');
    });

    it('should return an empty array if no doctors with the specified specialty exist', async () => {
      dataServicesMock.doctors.getDoctorBySpecialty.mockResolvedValue([]);

      try {
        await doctorUseCase.getDoctorBySpecialty('Cardiologia');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
      expect(dataServicesMock.doctors.getDoctorBySpecialty).toHaveBeenCalledWith('Cardiologia');
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
