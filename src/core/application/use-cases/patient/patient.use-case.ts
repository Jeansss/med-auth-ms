import { Injectable, NotFoundException } from "@nestjs/common";
import { IDataServices } from "src/core/domain/repositories/data-services.abstract";
import { Patient } from "src/core/domain/entities/patient.model";
import { PatientDTO } from "src/adapter/driver/dtos/patient.dto";
import { PatientFactoryService } from "./patient-factory.service";
import { PatientRepositoryImpl } from "src/adapter/driven/repositories/patient.repository";
import { PatientStatus } from "../../../domain/enums/patient.enum";

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