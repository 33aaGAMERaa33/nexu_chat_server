import { ContactRequestsStatus } from "src/contact_requests/contact_requests.entity";
import { ViewEntity, ViewColumn } from "typeorm";

@ViewEntity({
    name: "view_contact_requests",
    expression: `
    SELECT
        cr.id AS contact_request_id,
        cr.uuid AS contact_request_uuid,
        cr.status AS contact_request_status,

        sender.id AS sender_id,
        sender.uuid AS sender_uuid,
        sender.username AS sender_username,
        sender.email AS sender_email,

        receiver.id AS receiver_id,
        receiver.uuid AS receiver_uuid,
        receiver.username AS receiver_username,
        receiver.email AS receiver_email
    FROM contact_requests AS cr
    INNER JOIN users AS sender ON sender.id = cr.sender_id
    INNER JOIN users AS receiver ON receiver.id = cr.receiver_id
    `
})
export class ViewContactRequestsEntity {
    @ViewColumn()
    contact_request_id: number;

    @ViewColumn()
    contact_request_uuid: string;

    @ViewColumn()
    contact_request_status: ContactRequestsStatus;

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
