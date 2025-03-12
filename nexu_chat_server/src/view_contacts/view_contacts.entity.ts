import { ContactsStatus } from "src/contacts/contacts.entity";
import { ViewColumn, ViewEntity } from "typeorm";

@ViewEntity({
    name: "view_contacts",
    expression: `
        select 
        c.id as contact_id,
        sender.id as sender_id,
        receiver.id as receiver_id,
        sender.username as sender_username,
        receiver.username as receiver_username,
        sender.email as sender_email,
        receiver.email as receiver_email,
        c.created_at as created_at,
        c.updated_at as updated_at,
        c.status as status
        from contacts as c
        inner join contact_requests as cr on c.contact_request = cr.id
        inner join users as sender on sender.id = cr.sender
        inner join users as receiver on receiver.id = cr.receiver
    `
})
export class ViewContactsEntity {
    @ViewColumn()
    contact_id: number;

    @ViewColumn()
    sender_id: number;
    
    @ViewColumn()
    receiver_id: number;
    
    @ViewColumn()
    sender_username: string;

    @ViewColumn()
    receiver_username: string;

    @ViewColumn()
    sender_email: string;

    @ViewColumn()
    receiver_email: string;

    @ViewColumn()
    created_at: Date;

    @ViewColumn()
    status: ContactsStatus;
}
