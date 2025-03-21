import { PaginationDTO } from "src/_dto/pagination.dto";
import { UserDTO } from "src/users/dto/user.dto";
import { ContactRequestsStatus } from "../contact_requests.entity";

export interface ObterPedidosContatoDTO{
    userID: number;
    request_status: ContactRequestsStatus;
    search_sender: UserDTO;
    pagination: PaginationDTO;
}