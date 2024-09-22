import { Injectable } from "@nestjs/common";
import { MySqlGenericRepository } from "../external/mysql-generic-repository";
import { Doctor } from "../entities/doctor.model";

@Injectable()
export class DoctorRepositoryImpl extends MySqlGenericRepository<Doctor> {

    getDoctorByName(doctorName: string) {
        return this._repository
            .find({
                where: {
                    name: doctorName
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