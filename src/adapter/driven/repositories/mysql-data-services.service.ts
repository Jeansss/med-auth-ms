import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { IDataServices } from 'src/core/domain/repositories/data-services.abstract';
import { DoctorRepositoryImpl } from './doctor.repository';
import { Patient } from '../../../core/domain/entities/patient.model';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Doctor } from '../../../core/domain/entities/doctor.model';
import { MySqlGenericRepository } from './mysql-generic-repository';
import { PatientRepositoryImpl } from './patient.repository';

@Injectable()
export class MySqlDataServices
  implements IDataServices<MySqlGenericRepository<Doctor | Patient>>, OnApplicationBootstrap {
  doctors: DoctorRepositoryImpl;
  patients: PatientRepositoryImpl;

  constructor(
    @InjectRepository(Doctor)
    private DoctorRepository: Repository<Doctor>,
    @InjectRepository(Patient)
    private PatientRepository: Repository<Patient>,
  ) { }


  onApplicationBootstrap() {
    this.doctors = new DoctorRepositoryImpl(this.DoctorRepository);
    this.patients = new PatientRepositoryImpl(this.PatientRepository);
  }
}
