import { ContactRequestsEntity } from "src/contact_requests/contact_requests.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export enum ContactsStatus{
    active = "active",
    blocked = "blocked"
}

@Entity("contacts")
export class ContactsEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ContactRequestsEntity, { nullable: false })
    @JoinColumn({ name: "contact_request" }) // Nome da coluna no banco
    contactRequest: ContactRequestsEntity;

    @Column({type: "enum", enum: ContactsStatus, default: ContactsStatus.active})
    status: ContactsStatus;

    @CreateDateColumn({type: "timestamp", nullable: false})
    created_at: Date;

    @UpdateDateColumn({type: "timestamp", nullable: false})
    updated_at: Date;
}