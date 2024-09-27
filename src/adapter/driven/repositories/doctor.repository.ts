import { Injectable } from "@nestjs/common";
import { MySqlGenericRepository } from "./mysql-generic-repository";
import { Doctor } from "../../../core/domain/entities/doctor.model";

@Injectable()
export class DoctorRepositoryImpl extends MySqlGenericRepository<Doctor> {

    getDoctorBySpecialty(doctorSpecialty: string) {
        return this._repository
            .find({
                where: {
                    specialty: doctorSpecialty
                }
            });
    }

    getDoctorByEmail(doctorEmail: string) {
        return this._repository
            .find({
                where: {
                    email: doctorEmail
                }
            });
    }


}