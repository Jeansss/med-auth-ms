import { Interface } from "readline";
import { PatientDTO } from "src/adapter/driver/dtos/patient.dto";
import { Patient } from "src/core/domain/entities/patient.model";

export interface IPatientUseCase {
    getAllPatients(): Promise<Patient[]>;
    getPatientById(id: string): Promise<Patient>;
    createPatient(patientDTO: PatientDTO): Promise<Patient>;
    terminatePatient(patientId: string): Promise<void>;
}
