import { Body, Controller, Get, Param, Post, Put, Delete, HttpStatus, HttpCode, Logger, Query, NotFoundException, UseGuards, Inject } from '@nestjs/common';
import { ApiBearerAuth, ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/adapter/driver/auth/decorator-roles';
import { JwtAuthGuard } from 'src/adapter/driver/auth/jwt-auth.guard';
import { RolesGuard } from 'src/adapter/driver/auth/roles-guard';
import { DoctorDTO } from 'src/adapter/driver/dtos/doctor.dto';
import { Doctor } from 'src/core/domain/entities/doctor.model';
import { DoctorUseCase } from 'src/core/application/use-cases/doctor/doctor.use-case';
import { IDoctorUseCase } from 'src/core/application/use-cases/doctor/doctor.use-case.interface';

@ApiTags('Doctor')
@Controller('doctors')
export class DoctorController {

    private readonly logger = new Logger(DoctorController.name);

    constructor(@Inject('IDoctorUseCase') private doctorUseCases: IDoctorUseCase) {

    }

    @Get()
    async getAllDoctors(): Promise<Doctor[]> {
        this.logger.log(`getAllDoctors() - Start`);
        return await this.doctorUseCases.getAllDoctors();
    }

    @Post()
    async createDoctor(@Body() doctor: DoctorDTO): Promise<Doctor> {
        this.logger.log(`createDoctor - Start`);
        return await this.doctorUseCases.createDoctor(doctor);
    }

    @ApiExcludeEndpoint()
    @Get('/id/:doctorId')
    async getDoctorById(@Param('doctorId') doctorId: string): Promise<Doctor> {
        this.logger.log(`getDoctorById(string) - Start`);
        return await this.doctorUseCases.getDoctorById(doctorId);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('patient')
    @Get('/specialty/:specialty')
    async getDoctorBySpecialty(@Param('specialty') specialty: string): Promise<Doctor[]> {
        this.logger.log(`getDoctorBySpecialty(string) - Start`);
        return await this.doctorUseCases.getDoctorBySpecialty(specialty);
    }
}
