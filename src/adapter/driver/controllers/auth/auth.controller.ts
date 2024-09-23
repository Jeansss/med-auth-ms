import { Controller, Post, UseGuards, Request, Body, UnauthorizedException } from '@nestjs/common';
import { AuthUseCase } from '../../../../core/application/use-cases/auth/auth.use-case';
import { LoginDto } from 'src/adapter/driver/dtos/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthUseCase) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.authService.login(user);
  }
}
