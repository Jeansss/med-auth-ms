import { Injectable, NotFoundException } from "@nestjs/common";
import { IDataServices } from "src/core/domain/repositories/data-services.abstract";
import { DoctorFactoryService } from "./doctor-factory.service";
import { Doctor } from "src/core/domain/entities/doctor.model";
import { DoctorDTO } from "src/adapter/driver/dtos/doctor.dto";
import { DoctorRepositoryImpl } from "src/adapter/driven/repositories/doctor.repository";

@Injectable()
export class DoctorUseCase {

    constructor(private dataServices: IDataServices<DoctorRepositoryImpl>, private doctorFactoryService: DoctorFactoryService) { }

    async getAllDoctors(): Promise<Doctor[]> {
        return await this.dataServices.doctors.getAll();
    }


    async getDoctorById(id: string): Promise<Doctor> {
        const foundDoctor = await this.dataServices.doctors.get(id);
        if (foundDoctor != null) {
            return foundDoctor;
        } else {
            throw new NotFoundException(`Doctor with id: ${id} not found at database.`);
        }
    }

    async getDoctorByName(name: string): Promise<Doctor> {
        const foundDoctor = await this.dataServices.doctors.getDoctorByName(name);
        if (foundDoctor != null) {
            return foundDoctor[0];
        } else {
            throw new NotFoundException(`Doctor with name: ${name} not found at database.`);
        }
    }

    async createDoctor(doctorDTO: DoctorDTO): Promise<Doctor> {
        const newDoctor = await this.doctorFactoryService.createNewDoctor(doctorDTO);
        return this.dataServices.doctors.create(newDoctor);
    }
}