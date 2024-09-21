import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { IDataServices } from 'src/core/abstracts/data-services.abstract';
import { DataSource, Repository } from "typeorm";
import { MySqlDataServices } from './mysql-data-services.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './entities/patient.model';
import { Doctor } from './entities/doctor.model';

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([Patient, Doctor]),
    ],
    providers: [
        {
            provide: IDataServices,
            useClass: MySqlDataServices,
        }
    ],
    exports: [IDataServices],
})
export class MySqlDataServicesModule { }