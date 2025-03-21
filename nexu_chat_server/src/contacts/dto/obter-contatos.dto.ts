import { PaginationDTO } from "src/_dto/pagination.dto";
import { UserDTO } from "src/users/dto/user.dto";
import { ContactStatus } from "../contacts.entity";

export interface ObterContatosDTO{
    userID: number,
    status: ContactStatus,
    search_user: UserDTO,
    pagination: PaginationDTO,
}