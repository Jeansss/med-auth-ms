import { Injectable } from "@nestjs/common";
import { MySqlGenericRepository } from "../external/mysql-generic-repository";
import { Patient } from "../entities/patient.model";

@Injectable()
export class PatientRepositoryImpl extends MySqlGenericRepository<Patient> {

    getPatientByEmail(patientEmail: string) {
        return this._repository
            .find({
                where: {
                    email: patientEmail
                }
            });
    }
}