import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Doctor {
    @PrimaryGeneratedColumn()
    id!: number;
    @Column()
    name: string;
    @Column()
    cpf: string;
    @Column()
    crm: string;
    @Column()
    email: string;
    @Column()
    specialty: string;
    @Column()
    password: string;
    @Column()
    role: string;
}