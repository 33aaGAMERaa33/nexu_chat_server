import {HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from 'src/users/users.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TokenService {

    constructor(
        @InjectRepository(UsersEntity)
        private usersRepository: Repository<UsersEntity>,

        private readonly jwtService: JwtService,
    ) {}

    async validateTokenSession(token: string, runThrow: boolean = true) : Promise<any>{    
        try{
            let decoded = this.jwtService.decode(token);

            let userEntity = await this.usersRepository.findOne({
                where: {
                    id: decoded.id,
                    token: token    
                }
            });

            if(userEntity != null){
                return decoded;
            }else if(runThrow){
                return new HttpException("Token expirado", HttpStatus.UNAUTHORIZED);
            }
        }catch(e){
            if(runThrow){ 
                return new HttpException("Token inválido", HttpStatus.UNAUTHORIZED);
            }
        }

        return null;
    }
    
    extractToken(authHeader: string): string | null{
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return null;
        }
        
        return authHeader.split(" ")[1];
    }
}
