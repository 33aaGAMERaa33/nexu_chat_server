import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("users")
export class UsersEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: "uuid", nullable: false, unique: true})
    uuid: string;

    @Column({name: "username", nullable: false,})
    username: string;

    @Column({name: "email", nullable: false, unique: true})
    email: string;

    @Column({name: "password", nullable: false,})
    password: string

    @CreateDateColumn({name: "created_at", type: "timestamp"})
    created_at: Date;

    @UpdateDateColumn({name: "updated_at", type: "timestamp"})
    updated_at: Date;
}