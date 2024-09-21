import { Logger, Module } from '@nestjs/common';

import { PatientUseCaseModule } from './use-cases/patient/patient.use-cases.module';
import { AppController } from './controllers/app.controller';
import { PatientController } from './controllers/patient/patient.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './frameworks/data-services/mysql/entities/patient.model';
import { Doctor } from './frameworks/data-services/mysql/entities/doctor.model';
import { DoctorController } from './controllers/doctor/doctor.controller';
import { DoctorUseCase } from './use-cases/doctor/doctor.use-case';
import { DoctorUseCaseModule } from './use-cases/doctor/doctor.use-cases.module';

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
  ],
  controllers: [
    AppController,
    PatientController,
    DoctorController,
  ],
  providers: [],
})

export class AppModule {}
