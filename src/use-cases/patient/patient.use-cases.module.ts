import { Module } from "@nestjs/common";
import { DataServicesModule } from "src/services/data-services.module";
import { DataSource, Repository } from "typeorm";
import { IDataServices } from "src/core/abstracts/data-services.abstract";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Patient } from "src/frameworks/data-services/mysql/entities/patient.model";
import { PatientFactoryService } from "./patient-factory.service";
import { PatientUseCase } from "./patient.use-case";

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