import { Test, TestingModule } from '@nestjs/testing';
import { AuthUseCase } from 'src/core/application/use-cases/auth/auth.use-case';
import { LoginDto } from 'src/adapter/driver/dtos/login.dto';
import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from 'src/adapter/driver/controllers/auth/auth.controller';
import { IAuthUseCase } from 'src/core/application/use-cases/auth/auth.use-case.interface';

const mockAuthUseCase = (): jest.Mocked<IAuthUseCase> => ({
  validateUser: jest.fn(),
  login: jest.fn(),
} as jest.Mocked<IAuthUseCase>);

describe('AuthController', () => {
  let authController: AuthController;
  let authUseCase: jest.Mocked<IAuthUseCase>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: 'IAuthUseCase',
          useValue: mockAuthUseCase(),
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authUseCase = module.get<jest.Mocked<IAuthUseCase>>('IAuthUseCase');
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('login', () => {
    it('should return a JWT token if credentials are valid', async () => {
      const loginDto: LoginDto = { email: 'valid@example.com', password: 'password' };
      const user = { id: '1', email: 'valid@example.com', role: 'patient', name: 'Patient 1' };
      const token = 'jwt_token';
    
      authUseCase.validateUser.mockResolvedValue(user);
      authUseCase.login.mockResolvedValue(token);
    
      const result = await authController.login(loginDto);
    
      expect(result).toEqual(token);
      expect(authUseCase.validateUser).toHaveBeenCalledWith(loginDto.email, loginDto.password);
      expect(authUseCase.login).toHaveBeenCalledWith(user);
    });

    it('should throw an UnauthorizedException if credentials are invalid', async () => {
      const loginDto: LoginDto = { email: 'invalid@example.com', password: 'wrongpassword' };

      authUseCase.validateUser.mockResolvedValue(null);

      await expect(authController.login(loginDto)).rejects.toThrow(UnauthorizedException);
      
      expect(authUseCase.validateUser).toHaveBeenCalledWith(loginDto.email, loginDto.password);
      expect(authUseCase.login).not.toHaveBeenCalled();
    });
  });
});
