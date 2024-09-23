import { Module } from "@nestjs/common";
import { DoctorFactoryService } from "./doctor-factory.service";
import { DoctorUseCase } from "./doctor.use-case";
import { DataServicesModule } from "src/adapter/driven/database/data-services.module";

@Module({
    imports: [DataServicesModule],
    providers: [
        DoctorFactoryService,
        DoctorUseCase,
    ],
    exports: [
        DoctorFactoryService,
        DoctorUseCase,
    ]
})
export class DoctorUseCaseModule { }