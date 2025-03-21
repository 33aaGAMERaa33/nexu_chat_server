import { ContactRequestsEntity } from "src/contact_requests/contact_requests.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum ContactStatus{
    active = "active",
    blocked = "blocked"
}

@Entity("contacts")
export class ContactsEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: "uuid", nullable: false, unique: true})
    uuid: string;

    @OneToOne(() => ContactRequestsEntity, (contactRequest) => contactRequest.id)
    @JoinColumn({name: "contact_request_id"})
    contact_request: ContactRequestsEntity;

    @Column({name: "status", type: "enum", enum: ContactStatus, default: ContactStatus.active, nullable: false})
    status: ContactStatus;

    @CreateDateColumn({name: "created_at", type: "timestamp", nullable: false})
    created_at: Date;

    @UpdateDateColumn({name: "updated_at", type: "timestamp", nullable: false})
    updated_at: Date;
}