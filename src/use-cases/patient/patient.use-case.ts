import { Injectable, NotFoundException } from "@nestjs/common";
import { IDataServices } from "src/core/abstracts/data-services.abstract";
import { Patient } from "src/frameworks/data-services/mysql/entities/patient.model";
import { PatientDTO } from "src/dto/patient.dto";
import { PatientFactoryService } from "./patient-factory.service";
import { PatientStatus } from "src/enum/patient.enum";
import { MySqlGenericRepository } from "src/frameworks/data-services/mysql/external/mysql-generic-repository";
import { PatientRepositoryImpl } from "src/frameworks/data-services/mysql/gateways/patient.repository";

@Injectable()
export class PatientUseCase {

    constructor(private dataServices: IDataServices<PatientRepositoryImpl>, private patientFactoryService: PatientFactoryService) { }

    async getAllPatients(): Promise<Patient[]> {
        return await this.dataServices.patients.getAll();
    }

    async getPatientById(id: string): Promise<Patient> {
        const foundPatient = await this.dataServices.patients.get(id);
        if (foundPatient != null && foundPatient.status === PatientStatus.ACTIVE) {
            return foundPatient;
        } else {
            throw new NotFoundException(`Patient with id: ${id} not found at database.`);
        }
    }

    async createPatient(patientDTO: PatientDTO): Promise<Patient> {
        const newPatient = await this.patientFactoryService.createNewPatient(patientDTO);
        newPatient.status = PatientStatus.ACTIVE;
        return this.dataServices.patients.create(newPatient);
    }

    async terminatePatient(patientId: string): Promise<void> {
        const foundPatient = await this.getPatientById(patientId);
        foundPatient.status = PatientStatus.INACTIVE;
        await this.dataServices.patients.update(patientId, foundPatient);
    }

}