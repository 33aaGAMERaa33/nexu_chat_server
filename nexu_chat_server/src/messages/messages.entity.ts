import { ContactsEntity } from "src/contacts/contacts.entity";
import { UsersEntity } from "src/users/users.entity";
import { BeforeInsert, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

export enum MessagesType{
    text = "text",
    video = "video",
    audio = "audio",
}

@Entity({name: "messages"})
export class MessagesEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({name: "uuid", nullable: false, unique: true})
    uuid: string;

    @ManyToOne(() => ContactsEntity, (contact) => contact.id, {nullable: false})
    @JoinColumn({name: "contact_id"})
    contact: ContactsEntity;

    @ManyToOne(() => UsersEntity, (user) => user.id, {nullable: false})
    @JoinColumn({name: "sender_id"})
    sender: UsersEntity;
    
    @ManyToOne(() => UsersEntity, (user) => user.id, {nullable: false})
    @JoinColumn({name: "receiver_id"})
    receiver: UsersEntity;

    @Column({name: "message", nullable: false})
    message: string;

    @Column({name: "media_type", type: "enum", enum: MessagesType, nullable: false})
    media_type: MessagesType;

    @Column({name: "media_url", nullable: true})
    media_url: string;

    @CreateDateColumn({name: "sent_at", type: "timestamp"})
    sent_at: Date;
}