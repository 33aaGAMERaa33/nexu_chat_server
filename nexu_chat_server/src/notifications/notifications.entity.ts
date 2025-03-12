import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("notifications")
export class NotificationsEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn({type: "timestamp", nullable: false})
    created_at: Date;

    @Column({type: "timestamp", default: null, nullable: true})
    viewed: Date;
}