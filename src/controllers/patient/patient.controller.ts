import { Body, Controller, Get, Param, Post, Put, Delete, HttpStatus, HttpCode, Logger, Query, NotFoundException, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorator-roles';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles-guard';
import { PatientDTO } from 'src/dto/patient.dto';
import { Patient } from 'src/frameworks/data-services/mysql/entities/patient.model';
import { PatientUseCase } from 'src/use-cases/patient/patient.use-case';

@ApiTags('Patient')
@Controller('patients')
export class PatientController {

    private readonly logger = new Logger(PatientController.name);

    constructor(private patientUseCases: PatientUseCase) {

    }

    @Get()
    async getAllPatients(): Promise<Patient[]> {
        this.logger.log(`getAllPatients() - Start`);
        return await this.patientUseCases.getAllPatients();
    }

    @Post()
    async createPatient(@Body() patient: PatientDTO): Promise<Patient> {
        this.logger.log(`createPatient - Start`);
        return await this.patientUseCases.createPatient(patient);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('doctor')
    @Get('/id/:patientId')
    async getPatientById(@Param('patientId') patientId: string): Promise<Patient> {
        this.logger.log(`getPatientById(string) - Start`);
        return await this.patientUseCases.getPatientById(patientId);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('patient')
    @Post('/id/:patientId/terminate')
    async terminatePatient(@Param('patientId') patientId: string): Promise<void> {
        this.logger.log(`terminatePatient(string) - Start`);
        await this.patientUseCases.terminatePatient(patientId);
    }
}
