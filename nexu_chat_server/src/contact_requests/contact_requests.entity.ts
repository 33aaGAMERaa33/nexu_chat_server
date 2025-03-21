import { UsersEntity } from "src/users/users.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum ContactRequestsStatus{
    accepted = "accepted",
    rejected = "rejected",
    pending = "pending"
}

@Entity("contact_requests")
export class ContactRequestsEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: "uuid", nullable: false, unique: true})
    uuid: string;

    @ManyToOne(() => UsersEntity, (user: UsersEntity) => user.id, {nullable: false})
    @JoinColumn({name: "sender_id"})
    sender: UsersEntity;

    @ManyToOne(() => UsersEntity, (user: UsersEntity) => user.id, {nullable: false})
    @JoinColumn({name: "receiver_id"})
    receiver: UsersEntity;

    @Column({name: "status", type: "enum", enum: ContactRequestsStatus, default: ContactRequestsStatus.pending, nullable: false})
    status: ContactRequestsStatus;

    @CreateDateColumn({name: "created_at"})
    created_at: Date;

    @UpdateDateColumn({name: "updated_at"})
    updated_at: Date;
}