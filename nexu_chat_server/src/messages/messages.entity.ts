import { ContactsEntity } from "src/contacts/contacts.entity";
import { UsersEntity } from "src/users/users.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("messages")
export class MessagesEntity{
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ContactsEntity, (contact) => contact.id)
    @JoinColumn({name: "contact"})
    contact: ContactsEntity

    @ManyToOne(() => UsersEntity, (user) => user.id)
    sender: UsersEntity;

    @ManyToOne(() => UsersEntity, (user) => user.id)
    receiver: UsersEntity;

    @Column({name: "message", nullable: false})
    message: string;

    @Column({name: "sent_at", nullable: false, type: "timestamp"})
    sent_at: Date;
}