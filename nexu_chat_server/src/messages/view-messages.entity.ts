import { ViewColumn, ViewEntity } from "typeorm";
import { MessagesType } from "./messages.entity";

@ViewEntity({
    name: "view_messages",
    expression: `
    select 
    
    c.id as contact_id,
    c.uuid as contact_uuid,

    sender.id as sender_id,
    sender.uuid as sender_uuid,
    sender.username as sender_username,
    sender.email as sender_email,

    receiver.id as receiver_id,
    receiver.uuid as receiver_uuid,
    receiver.username as receiver_username,
    receiver.email as receiver_email,

    msg.message as message,
    msg.media_type as type,
    msg.media_url as url,
    msg.sent_at as sent_at

    from messages as msg
    inner join contacts as c on c.id = msg.contact_id
    inner join contact_requests as cr on cr.id = c.contact_request_id
    inner join users as sender on sender.id = msg.sender_id
    inner join users as receiver on receiver.id = msg.receiver_id
    `
})
export class ViewMessagesEntity{
    @ViewColumn()
    contact_id: number;
    @ViewColumn()
    contact_uuid: string;

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

    @ViewColumn()
    message: string;
    @ViewColumn()
    type: MessagesType;
    @ViewColumn()
    url: string;
    @ViewColumn()
    sent_at: Date;
}