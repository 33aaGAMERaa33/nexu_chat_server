import { ViewColumn, ViewEntity } from "typeorm";
import { ContactStatus } from "./contacts.entity";

@ViewEntity({
    name: "view_contacts",
    expression: `
    select 
    c.id as contact_id,
    c.uuid as contact_uuid,
    c.status as contact_status,

    sender.id as sender_id,
    sender.uuid as sender_uuid,
    sender.username as sender_username,
    sender.email as sender_email,
    
    receiver.id as receiver_id,
    receiver.uuid as receiver_uuid,
    receiver.username as receiver_username,
    receiver.email as receiver_email

    from contacts as c
    inner join contact_requests as cr on cr.id = c.contact_request_id
    inner join users as sender on sender.id = cr.sender_id
    inner join users as receiver on receiver.id = cr.receiver_id
    `
})
export class ViewContactsEntity{
    @ViewColumn()
    contact_id: number;
    @ViewColumn()
    contact_uuid: string;
    @ViewColumn()
    contact_status: ContactStatus;

    @ViewColumn()
    sender_id: number;
    @ViewColumn()
    sender_uuid: string;
    @ViewColumn()
    sender_username: string;
    @ViewColumn()
    sender_email: string;

    @ViewColumn()
    receiver_id: number;
    @ViewColumn()
    receiver_uuid: string;
    @ViewColumn()
    receiver_username: string;
    @ViewColumn()
    receiver_email: string;
}