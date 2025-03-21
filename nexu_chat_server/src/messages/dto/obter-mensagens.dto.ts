import { PaginationDTO } from "src/_dto/pagination.dto";

export interface ObterMensagensDto{
    userID: number,
    contact_uuid: string,
    pagination: PaginationDTO
}