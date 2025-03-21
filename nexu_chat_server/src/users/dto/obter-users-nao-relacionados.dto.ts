import { PaginationDTO } from "src/_dto/pagination.dto";
import { UserDTO } from "./user.dto";

export interface ObterUsersNaoRelacionadosDTO{
    userID: number;
    search: UserDTO;
    pagination: PaginationDTO
}