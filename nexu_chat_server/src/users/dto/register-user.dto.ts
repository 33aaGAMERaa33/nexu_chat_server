import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

const senhaLength = 6;

export class RegisterUserDTO{
    @IsNotEmpty({message: "Nome de usuario não informado"})
    username: string;

    @IsNotEmpty({message: "Email não informado"})
    @IsEmail({}, {message: "Email invalido"})
    email: string;

    @IsNotEmpty({message: "Senha não informada"})
    @MinLength(senhaLength, {message: `A senha deve ter no minimo ${senhaLength} caracteres`})
    password: string;
}