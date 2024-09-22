import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { IDataServices } from 'src/core/abstracts/data-services.abstract';
import { DoctorRepositoryImpl } from './gateways/doctor.repository';
import { Patient } from './entities/patient.model';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.model';
import { MySqlGenericRepository } from './external/mysql-generic-repository';
import { PatientRepositoryImpl } from './gateways/patient.repository';

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
