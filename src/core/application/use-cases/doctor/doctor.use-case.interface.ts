import { DoctorDTO } from "src/adapter/driver/dtos/doctor.dto";
import { Doctor } from "src/core/domain/entities/doctor.model";

export interface IDoctorUseCase {
    getAllDoctors(): Promise<Doctor[]>;
    getDoctorById(id: string): Promise<Doctor>;
    getDoctorBySpecialty(specialty: string): Promise<Doctor[]>;
    createDoctor(doctorDTO: DoctorDTO): Promise<Doctor>;
}