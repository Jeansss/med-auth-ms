import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IDataServices } from 'src/core/domain/repositories/data-services.abstract';
import { Patient } from 'src/core/domain/entities/patient.model';
import * as bcrypt from 'bcrypt';
import { MySqlGenericRepository } from 'src/adapter/driven/repositories/mysql-generic-repository';


@Injectable()
export class AuthUseCase {
  constructor(
    private dataServices: IDataServices<MySqlGenericRepository<Patient>>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    let user = await this.dataServices.patients.getAll().then((patients) =>
      patients.find((patient) => patient.email === email)
    );

    if (user && await bcrypt.compare(password, user.password)) {
      return { id: user.id, username: user.email, role: 'patient', name: user.name };
    }

    user = await this.dataServices.doctors.getAll().then((doctors) =>
      doctors.find((doctor) => doctor.email === email)
    );

    if (user && await bcrypt.compare(password, user.password)) {
      return { id: user.id, username: user.email, role: 'doctor', name: user.name };
    }

    return null;
  }

  async login(user: any) {
    const payload = { username: user.email, sub: user.id, role: user.role, name: user.name };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

