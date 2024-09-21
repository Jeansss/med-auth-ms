import { Injectable } from "@nestjs/common";
import { PatientDTO } from "src/dto/patient.dto";
import { Patient } from "src/frameworks/data-services/mysql/entities/patient.model";

@Injectable()
export class PatientFactoryService {
    createNewPatient(patientDTO: PatientDTO) {
        const newPatient = new Patient();
        newPatient.cpf = patientDTO.cpf;
        newPatient.email = patientDTO.email;
        newPatient.name = patientDTO.name;

        return newPatient;
    }
}