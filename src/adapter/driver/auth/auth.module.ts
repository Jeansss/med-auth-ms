import { Module } from '@nestjs/common';
import { AuthUseCase } from '../../../core/application/use-cases/auth/auth.use-case';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { MySqlDataServicesModule } from 'src/adapter/driven/database/mysql-data-services.module';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.MS_SECRET_KEY,
      signOptions: { expiresIn: '60m' },
    }),
    MySqlDataServicesModule,
  ],
  providers: [
    JwtStrategy,
    {
      provide: 'IAuthUseCase',
      useClass: AuthUseCase,
    },
  ],
  exports: [
    'IAuthUseCase',
  ],
})
export class AuthModule {}
