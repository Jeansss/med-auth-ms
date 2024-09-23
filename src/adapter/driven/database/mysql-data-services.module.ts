import { Module } from '@nestjs/common';
import { ConfigModule } from "@nestjs/config";
import { IDataServices } from 'src/core/domain/repositories/data-services.abstract';
import { DataSource, Repository } from "typeorm";
import { MySqlDataServices } from '../repositories/mysql-data-services.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from '../../../core/domain/entities/patient.model';
import { Doctor } from '../../../core/domain/entities/doctor.model';

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