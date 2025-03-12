import { IsString, IsEmail} from 'class-validator';

export class UpdateUserDto {
    @IsString()
    username?: string;
    
    @IsEmail()
    email?: string;

    @IsString()
    password?: string;

    @IsString()
    token?: string;
}
