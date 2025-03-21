import { IsEmail, IsNotEmpty } from "class-validator";

export class LoginUserDTO{
    @IsNotEmpty({message: "Email não informado"})
    @IsEmail({}, {message: "Email invalido"})
    email: string;

    @IsNotEmpty({message: "Senha não informada"})
    password: string;
}