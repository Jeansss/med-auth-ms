import { Module } from "@nestjs/common";
import { DoctorFactoryService } from "./doctor-factory.service";
import { DoctorUseCase } from "./doctor.use-case";
import { DataServicesModule } from "src/adapter/driven/database/data-services.module";

@Module({
    imports: [DataServicesModule],
    providers: [
        DoctorFactoryService,
        {
          provide: 'IDoctorUseCase',
          useClass: DoctorUseCase,
        },
      ],
      exports: [
        DoctorFactoryService,
        'IDoctorUseCase',
      ],
    })
export class DoctorUseCaseModule { }
