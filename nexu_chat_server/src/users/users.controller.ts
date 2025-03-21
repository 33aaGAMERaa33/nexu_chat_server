import { Body, Controller, HttpException, HttpStatus, Post, Request, UseGuards, } from '@nestjs/common';
import { RegisterUserDTO } from './dto/register-user.dto';
import { UsersService } from './users.service';
import { LoginUserDTO } from './dto/login-user.dto';
import { UsersEntity } from './users.entity';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { ObterUsersNaoRelacionadosDTO } from './dto/obter-users-nao-relacionados.dto';

@Controller('users')
export class UsersController {
    constructor(
       private readonly usersService: UsersService,
       private readonly authService: AuthService
    ) {}

    @Post('obter-users-nao-relacionados')
    @UseGuards(AuthGuard('jwt'))
    async obterUsersNaoRelacionados(@Body() data: ObterUsersNaoRelacionadosDTO, @Request() req) {
        const token = req.headers.authorization?.replace('Bearer ', '');
        const tokenValido = await this.authService.decodeToken(token);
        try {
            const users = await this.usersService.obterUsersNaoRelacionados({
                ...data,
                userID: tokenValido.id
            });

            return {
                status: 'success',
                message: 'Retorno de usuários',
                users: users,
            };
        } catch (e) {
            throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
        }
    }
    @Post("login")
    async login(@Body() data: LoginUserDTO){
        let user: UsersEntity;

        try{
            user = await this.usersService.validarLogin(data);
        }catch(e){
            throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
        }


        let token = await this.authService.generateToken(user);

        return {
            "status": "success",
            "message": "Login efetuado com êxito",
            "user": {
                "uuid": user.uuid,
                "username": user.username,
                "email": user.email,
                "token": token,
            } 
        };
    }
    @Post("logout")
    async logout(){
        return {
            "status": "success",
            "message": "Sessão encerrada"
        };
    }
    @Post("register")
    async register(@Body() data: RegisterUserDTO){
        try{
            await this.usersService.registrarUsuario(data);
        }catch(e){
            throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
        }

        return {
            "status": "success",
            "message": "Registrado com succeso"
        };
    }
}