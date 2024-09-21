import { Module } from "@nestjs/common";
import { DataServicesModule } from "src/services/data-services.module";
import { DoctorFactoryService } from "./doctor-factory.service";
import { DoctorUseCase } from "./doctor.use-case";

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