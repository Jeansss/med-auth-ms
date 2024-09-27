import { Injectable, NotFoundException } from "@nestjs/common";
import { IDataServices } from "src/core/domain/repositories/data-services.abstract";
import { DoctorFactoryService } from "./doctor-factory.service";
import { Doctor } from "src/core/domain/entities/doctor.model";
import { DoctorDTO } from "src/adapter/driver/dtos/doctor.dto";
import { DoctorRepositoryImpl } from "src/adapter/driven/repositories/doctor.repository";
import { IDoctorUseCase } from "./doctor.use-case.interface";

@Injectable()
export class DoctorUseCase implements IDoctorUseCase {

    constructor(private dataServices: IDataServices<DoctorRepositoryImpl>, private doctorFactoryService: DoctorFactoryService) { }

    async getAllDoctors(): Promise<Doctor[]> {
        const doctors = await this.dataServices.doctors.getAll();
        doctors.forEach(doctor => {
            delete doctor.password;
        });
        return doctors;
    }


    async getDoctorById(id: string): Promise<Doctor> {
        const foundDoctor = await this.dataServices.doctors.get(id);
        if (foundDoctor != null) {
            delete foundDoctor.password;
            return foundDoctor;
        } else {
            throw new NotFoundException(`Doctor with id: ${id} not found at database.`);
        }
    }

    async getDoctorBySpecialty(specialty: string): Promise<Doctor[]> {
        const foundDoctor = await this.dataServices.doctors.getDoctorBySpecialty(specialty);
        if (foundDoctor[0] != null) {
            foundDoctor.forEach(doctor => {
                delete doctor.password;
            });
            return foundDoctor;
        } else {
            throw new NotFoundException(`Doctor with specialty: ${specialty} not found at database.`);
        }
    }

    async createDoctor(doctorDTO: DoctorDTO): Promise<Doctor> {
        const newDoctor = await this.doctorFactoryService.createNewDoctor(doctorDTO);
        await this.dataServices.doctors.create(newDoctor);
        delete newDoctor.password;
        return newDoctor;
    }
}
