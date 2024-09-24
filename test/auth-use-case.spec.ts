import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { IDataServices } from 'src/core/domain/repositories/data-services.abstract';
import { Patient } from 'src/core/domain/entities/patient.model';
import { Doctor } from 'src/core/domain/entities/doctor.model';
import * as bcrypt from 'bcrypt';
import { AuthUseCase } from 'src/core/application/use-cases/auth/auth.use-case';

const mockDataServices = () => ({
  patients: {
    getAll: jest.fn(),
  },
  doctors: {
    getAll: jest.fn(),
  },
});

const mockJwtService = () => ({
  sign: jest.fn(),
});

describe('AuthUseCase', () => {
  let authUseCase: AuthUseCase;
  let dataServicesMock: ReturnType<typeof mockDataServices>;
  let jwtServiceMock: ReturnType<typeof mockJwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthUseCase,
        { provide: IDataServices, useValue: mockDataServices() },
        { provide: JwtService, useValue: mockJwtService() },
      ],
    }).compile();

    authUseCase = module.get<AuthUseCase>(AuthUseCase);
    dataServicesMock = module.get(IDataServices);
    jwtServiceMock = module.get(JwtService);

    dataServicesMock.patients.getAll.mockResolvedValue([]);
    dataServicesMock.doctors.getAll.mockResolvedValue([]);
    
    (bcrypt.compare as jest.Mock) = jest.fn();
  });

  it('should be defined', () => {
    expect(authUseCase).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user details if patient email and password are correct', async () => {
      const patient: Patient = {
        id: '1',
        name: 'Patient 1',
        email: 'patient1@example.com',
        password: 'hashed_password',
      } as unknown as Patient;

      dataServicesMock.patients.getAll.mockResolvedValue([patient]);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authUseCase.validateUser('patient1@example.com', 'password');

      expect(result).toEqual({
        id: '1',
        username: 'patient1@example.com',
        role: 'patient',
        name: 'Patient 1',
      });
      expect(dataServicesMock.patients.getAll).toHaveBeenCalled();
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashed_password');
    });

    it('should return user details if doctor email and password are correct', async () => {
      const doctor: Doctor = {
        id: '1',
        name: 'Doctor 1',
        email: 'doctor1@example.com',
        password: 'hashed_password',
      } as unknown as Doctor;

      dataServicesMock.patients.getAll.mockResolvedValue([]);
      dataServicesMock.doctors.getAll.mockResolvedValue([doctor]);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authUseCase.validateUser('doctor1@example.com', 'password');

      expect(result).toEqual({
        id: '1',
        username: 'doctor1@example.com',
        role: 'doctor',
        name: 'Doctor 1',
      });
      expect(dataServicesMock.doctors.getAll).toHaveBeenCalled();
      expect(bcrypt.compare).toHaveBeenCalledWith('password', 'hashed_password');
    });

    it('should return null if email is not found', async () => {
      dataServicesMock.patients.getAll.mockResolvedValue([]);
      dataServicesMock.doctors.getAll.mockResolvedValue([]);

      const result = await authUseCase.validateUser('unknown@example.com', 'password');

      expect(result).toBeNull();
      expect(dataServicesMock.patients.getAll).toHaveBeenCalled();
      expect(dataServicesMock.doctors.getAll).toHaveBeenCalled();
    });

    it('should return null if password is incorrect', async () => {
      const patient: Patient = {
        id: '1',
        name: 'Patient 1',
        email: 'patient1@example.com',
        password: 'hashed_password',
      } as unknown as Patient;

      dataServicesMock.patients.getAll.mockResolvedValue([patient]);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await authUseCase.validateUser('patient1@example.com', 'wrong_password');

      expect(result).toBeNull();
      expect(dataServicesMock.patients.getAll).toHaveBeenCalled();
      expect(bcrypt.compare).toHaveBeenCalledWith('wrong_password', 'hashed_password');
    });
  });

  describe('login', () => {
    it('should generate JWT token for valid user', async () => {
      const user = { id: '1', email: 'patient1@example.com', role: 'patient', name: 'Patient 1' };
      const token = 'jwt_token';
      jwtServiceMock.sign.mockReturnValue(token);

      const result = await authUseCase.login(user);

      expect(result).toEqual({ access_token: token });
      expect(jwtServiceMock.sign).toHaveBeenCalledWith({
        username: user.email,
        sub: user.id,
        role: user.role,
        name: user.name,
      });
    });
  });
});