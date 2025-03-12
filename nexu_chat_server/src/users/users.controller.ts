import { 
    Body, Controller, Post, Req, HttpException, HttpStatus, Headers, 
    Get
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from "bcryptjs";
import { JwtService } from '@nestjs/jwt';
import { TokenService } from 'src/token/token.service';
import { ObterUsuariosDto } from './dto/obter-usuarios.dto';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly tokenService: TokenService,
    ) {}
    @Post("obter-usuarios")
    async obterUsuarios(@Body() obterUsuariosDto: ObterUsuariosDto, @Headers("authorization") authHeader: string){
        const token = this.tokenService.extractToken(authHeader);
        const tokenValido = await this.tokenService.validateTokenSession(token ?? "");

        if(tokenValido instanceof HttpException){
            throw tokenValido;
        }

        if(tokenValido instanceof HttpException){
            throw tokenValido;
        }

        const {usuarios, page} = await this.usersService.obterUsersNaoRelacionadosAoUser(obterUsuariosDto, tokenValido.id);

        return {
            "status": "success",
            "message": "Retorno de usuarios",
            "users": usuarios,
            "page": page
        };
    }
    @Post("login")
    async login(@Body() loginUserDto: LoginUserDto) {
        const user = await this.usersService.findOne({
            where: { email: loginUserDto.email }
        });
        
        if (!user || !(await bcrypt.compare(loginUserDto.password, user.password))) {
            throw new HttpException("Credenciais inválidas", HttpStatus.UNAUTHORIZED);
        }

        const payload = { 
            id: user.id,
            username: user.username,
            email: user.email,
            sessionId: Date.now()
        };

        const token = this.jwtService.sign(payload);
        
        await this.usersService.update(user.id, { token });
        
        return {
            status: "success",
            message: "Login realizado com sucesso",
            data: { username: user.username, email: user.email },
            token,
        };
    }

    @Post("logout")
    async logout(@Headers("authorization") authHeader: string) {
        const token = this.tokenService.extractToken(authHeader);
        const tokenValido = await this.tokenService.validateTokenSession(token ?? "");

        if(tokenValido instanceof HttpException){
            throw tokenValido;
        }

        await this.usersService.update(tokenValido.id, { token: "invalidado" });

        return {
            status: "success",
            message: "Sessão encerrada"
        };
    }

    @Post("register")
    async register(@Body() createUserDto: CreateUserDto) {
        const userExists = await this.usersService.findOne({
            where: { email: createUserDto.email }
        });
        
        if (userExists) {
            throw new HttpException("Email já está em uso", HttpStatus.BAD_REQUEST);
        }
        
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        const user = await this.usersService.create({
            ...createUserDto,
            password: hashedPassword,
        });
        
        return {
            status: "success",
            message: "Usuário cadastrado com sucesso",
            user: { username: user.username, email: user.email }
        };
    }
    
    @Post("obter-usuario")
    async obterUsuario(@Headers("authorization") authHeader: string) {
        const token = this.tokenService.extractToken(authHeader);
        const tokenValido = await this.tokenService.validateTokenSession(token ?? "");

        if(tokenValido instanceof HttpException){
            throw tokenValido;
        }
        
        const userEntity = await this.usersService.findOne({ where: { id: tokenValido.id } });
        
        if (!userEntity) {
            throw new HttpException("Usuário não encontrado", HttpStatus.NOT_FOUND);
        }

        return {
            status: "success",
            message: "Usuário encontrado",
            data: { 
                id: userEntity.id,
                username: userEntity.username,
                email: userEntity.email 
            }
        };
    }
}
