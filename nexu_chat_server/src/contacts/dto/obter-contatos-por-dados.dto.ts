import { IsNumber, IsString } from "class-validator";
import { ContactsStatus } from "../contacts.entity";

export class ObterContatosPorDadosDto{
    @IsString()
    username: string;

    @IsString()
    status: ContactsStatus;
}