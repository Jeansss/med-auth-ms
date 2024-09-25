import { Logger, Module } from '@nestjs/common';

import { PatientUseCaseModule } from './core/application/use-cases/patient/patient.use-cases.module';
import { AppController } from './adapter/driver/controllers/app.controller';
import { PatientController } from './adapter/driver/controllers/patient/patient.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './core/domain/entities/patient.model';
import { Doctor } from './core/domain/entities/doctor.model';
import { DoctorController } from './adapter/driver/controllers/doctor/doctor.controller';
import { DoctorUseCase } from './core/application/use-cases/doctor/doctor.use-case';
import { DoctorUseCaseModule } from './core/application/use-cases/doctor/doctor.use-cases.module';
import { AuthModule } from './adapter/driver/auth/auth.module';
import { AuthController } from './adapter/driver/controllers/auth/auth.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.MYSQL_HOST,
      port: parseInt(process.env.MYSQL_PORT, 10),
      username: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      entities: [Patient, Doctor],
      database: 'users',
      synchronize: true,
      // logging: true,
    }),
    PatientUseCaseModule,
    DoctorUseCaseModule,
    AuthModule,
  ],
  controllers: [
    AppController,
    PatientController,
    DoctorController,
    AuthController,
  ],
  providers: [],
})

export class AppModule {}
