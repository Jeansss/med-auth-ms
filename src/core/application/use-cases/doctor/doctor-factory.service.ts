import { Injectable } from "@nestjs/common";
import { DoctorDTO } from "src/adapter/driver/dtos/doctor.dto";
import { Doctor } from "src/core/domain/entities/doctor.model";
import * as bcrypt from 'bcrypt';

@Injectable()
export class DoctorFactoryService {

    async createNewDoctor(doctorDTO: DoctorDTO) {
        const hashedPassword = await bcrypt.hash(doctorDTO.password, 10);

        const newDoctor = new Doctor();
        newDoctor.cpf = doctorDTO.cpf;
        newDoctor.email = doctorDTO.email;
        newDoctor.name = doctorDTO.name;
        newDoctor.crm = doctorDTO.crm;
        newDoctor.specialty = doctorDTO.specialty;
        newDoctor.password = hashedPassword;
        newDoctor.role = 'doctor';
    
        return newDoctor;
    }

}