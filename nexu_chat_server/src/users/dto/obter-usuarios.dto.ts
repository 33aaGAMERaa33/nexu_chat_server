import { IsEmail, IsInt, IsString,} from "class-validator";

export class ObterUsuariosDto{
    @IsString()
    uuid?: string;
    @IsString()
    username?: string;
    @IsEmail()
    email?: string;
    @IsInt()
    page?: number;
}