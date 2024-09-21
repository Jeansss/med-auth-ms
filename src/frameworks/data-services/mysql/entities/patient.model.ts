import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Patient {
    @PrimaryGeneratedColumn()
    id!: number;
    @Column()
    name: string;
    @Column()
    cpf: string;
    @Column()
    email: string;
    @Column()
    status: string;
}