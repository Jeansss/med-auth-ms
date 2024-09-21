import { Injectable } from "@nestjs/common";
import { DoctorDTO } from "src/dto/doctor.dto";
import { Doctor } from "src/frameworks/data-services/mysql/entities/doctor.model";

@Injectable()
export class DoctorFactoryService {

    createNewDoctor(doctorDTO: DoctorDTO) {
        const newDoctor = new Doctor();
        newDoctor.cpf = doctorDTO.cpf;
        newDoctor.email = doctorDTO.email;
        newDoctor.name = doctorDTO.name;
        newDoctor.crm = doctorDTO.crm;
        newDoctor.specialty = doctorDTO.specialty;
    
        return newDoctor;
    }

}