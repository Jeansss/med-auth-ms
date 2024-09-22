import { Injectable } from "@nestjs/common";
import { PatientDTO } from "src/dto/patient.dto";
import { Patient } from "src/frameworks/data-services/mysql/entities/patient.model";
import * as bcrypt from 'bcrypt';

@Injectable()
export class PatientFactoryService {
    async createNewPatient(patientDTO: PatientDTO) {
        const hashedPassword = await bcrypt.hash(patientDTO.password, 10);
        const newPatient = new Patient();
        newPatient.cpf = patientDTO.cpf;
        newPatient.email = patientDTO.email;
        newPatient.name = patientDTO.name;
        newPatient.password = hashedPassword;
        newPatient.role = 'patient';

        return newPatient;
    }
}
