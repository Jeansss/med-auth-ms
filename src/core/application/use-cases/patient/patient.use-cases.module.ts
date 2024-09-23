import { Module } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { IDataServices } from "src/core/domain/repositories/data-services.abstract";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Patient } from "src/core/domain/entities/patient.model";
import { PatientFactoryService } from "./patient-factory.service";
import { PatientUseCase } from "./patient.use-case";
import { DataServicesModule } from "src/adapter/driven/database/data-services.module";

@Module({
    imports: [DataServicesModule],
    providers: [
        PatientFactoryService,
        PatientUseCase,
    ],
    exports: [
        PatientFactoryService,
        PatientUseCase,
    ]
})
export class PatientUseCaseModule { }