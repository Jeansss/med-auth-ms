import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IDataServices } from 'src/core/abstracts/data-services.abstract';
import { Patient } from 'src/frameworks/data-services/mysql/entities/patient.model';
import { MySqlGenericRepository } from 'src/frameworks/data-services/mysql/external/mysql-generic-repository';

import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
  constructor(
    private dataServices: IDataServices<MySqlGenericRepository<Patient>>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    let user = await this.dataServices.patients.getAll().then((patients) =>
      patients.find((patient) => patient.email === email)
    );

    if (user && await bcrypt.compare(password, user.password)) {
      return { id: user.id, username: user.email, role: 'patient' };
    }

    user = await this.dataServices.doctors.getAll().then((doctors) =>
      doctors.find((doctor) => doctor.email === email)
    );

    if (user && await bcrypt.compare(password, user.password)) {
      return { id: user.id, username: user.email, role: 'doctor' };
    }

    return null;
  }

  async login(user: any) {
    const payload = { username: user.email, sub: user.id, role: user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

