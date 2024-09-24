import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DoctorRepositoryImpl } from 'src/adapter/driven/repositories/doctor.repository';
import { Doctor } from 'src/core/domain/entities/doctor.model';

const mockRepository = () => ({
  find: jest.fn(),
  findOneBy: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('DoctorRepositoryImpl', () => {
  let doctorRepository: DoctorRepositoryImpl;
  let repositoryMock: jest.Mocked<Repository<Doctor>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DoctorRepositoryImpl,
        {
          provide: getRepositoryToken(Doctor),
          useValue: mockRepository(),
        },
      ],
    }).compile();

    doctorRepository = new DoctorRepositoryImpl(module.get(getRepositoryToken(Doctor))); // Instanciar manualmente com o mock do repositório
    repositoryMock = module.get(getRepositoryToken(Doctor)); // Obter o mock do repositório
  });

  it('should be defined', () => {
    expect(doctorRepository).toBeDefined();
  });

  describe('createDoctor', () => {
    it('should create a new doctor and return the created doctor object', async () => {
      const doctor = { id: 1, name: 'Dr. Mario', email: 'test@doctor.com', cpf: '12345678999', password: 'test123456', specialty: 'clinico', role: 'doctor' } as Doctor;
      repositoryMock.save.mockResolvedValue(doctor);

      const result = await doctorRepository.create(doctor);

      expect(result).toEqual(doctor);
      expect(repositoryMock.save).toHaveBeenCalledWith(doctor);
    });
  });

  describe('getDoctorByName', () => {
    it('should return the doctor with the specified name', async () => {
      const doctor = { id: 1, name: 'Dr. Mario', email: 'test@doctor.com', cpf: '12345678999', password: 'test123456', specialty: 'clinico', role: 'doctor' } as Doctor;
      repositoryMock.find.mockResolvedValue([doctor]);

      const result = await doctorRepository.getDoctorByName('Dr. Mario');

      expect(result).toEqual([doctor]);
      expect(repositoryMock.find).toHaveBeenCalledWith({
        where: { name: 'Dr. Mario' },
      });
    });

    it('should return an empty array if no doctor is found with the specified name', async () => {
      repositoryMock.find.mockResolvedValue([]);

      const result = await doctorRepository.getDoctorByName('Nonexistent Doctor');

      expect(result).toEqual([]);
      expect(repositoryMock.find).toHaveBeenCalledWith({
        where: { name: 'Nonexistent Doctor' },
      });
    });
  });

  describe('getDoctorByEmail', () => {
    it('should return the doctor with the specified email', async () => {
      const doctor = { id: 1, name: 'Dr. Mario', email: 'test@doctor.com', cpf: '12345678999', password: 'test123456', specialty: 'clinico', role: 'doctor' } as Doctor;
      repositoryMock.find.mockResolvedValue([doctor]);

      const result = await doctorRepository.getDoctorByEmail('test@doctor.com');

      expect(result).toEqual([doctor]);
      expect(repositoryMock.find).toHaveBeenCalledWith({
        where: { email: 'test@doctor.com' },
      });
    });

    it('should return an empty array if no doctor is found with the specified email', async () => {
      repositoryMock.find.mockResolvedValue([]);

      const result = await doctorRepository.getDoctorByEmail('nonexistent@doctor.com');

      expect(result).toEqual([]);
      expect(repositoryMock.find).toHaveBeenCalledWith({
        where: { email: 'nonexistent@doctor.com' },
      });
    });
  });

  describe('getDoctorById', () => {
    it('should return the doctor with the specified ID', async () => {
      const doctor = { id: 1, name: 'Dr. Mario', email: 'test@doctor.com', cpf: '12345678999', password: 'test123456', specialty: 'clinico', role: 'doctor' } as Doctor;
      repositoryMock.findOneBy.mockResolvedValue(doctor);

      const result = await doctorRepository.get(1);

      expect(result).toEqual(doctor);
      expect(repositoryMock.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return null if the doctor with the specified ID does not exist', async () => {
      repositoryMock.findOneBy.mockResolvedValue(null);

      const result = await doctorRepository.get(999);

      expect(result).toBeNull();
      expect(repositoryMock.findOneBy).toHaveBeenCalledWith({ id: 999 });
    });
  });
});
