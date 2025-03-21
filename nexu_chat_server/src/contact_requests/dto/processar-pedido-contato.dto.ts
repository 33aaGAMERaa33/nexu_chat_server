import { ContactRequestsStatus } from "../contact_requests.entity";

export interface ProcessarPedidoContatoDTO{
    userID: number;
    pedido_uuid: string;
    status: ContactRequestsStatus;
}