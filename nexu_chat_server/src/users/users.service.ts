import { Injectable } from '@nestjs/common';
import { RegisterUserDTO } from './dto/register-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { Repository } from 'typeorm';
import { BuscarUsuarioDTO } from './dto/buscar-usuario.dto';
import * as bcryptjs from "bcryptjs";
import {v4 as uuidv4} from 'uuid';
import { LoginUserDTO } from './dto/login-user.dto';
import { ContactRequestsEntity } from 'src/contact_requests/contact_requests.entity';
import { ObterUsersNaoRelacionadosDTO } from './dto/obter-users-nao-relacionados.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UsersEntity)
        private readonly usersRepository: Repository<UsersEntity>,
        @InjectRepository(ContactRequestsEntity)
        private readonly contactRequestsRepository: Repository<ContactRequestsEntity>
    ) {}
    async obterUsersNaoRelacionados(data: ObterUsersNaoRelacionadosDTO): Promise<UsersEntity[]>{
        let limit = data.pagination.limit ?? 50;
        let page = data.pagination.page ?? 1;

        limit = limit > 50 ? 50 : limit;
        page = page < 1 ? 1 : page;

        let subQuery = `
        select cr.sender_id from contact_requests as cr
        where cr.sender_id = :userID or cr.receiver_id = :userID
        union all
        select cr.receiver_id from contact_requests as cr
        where cr.sender_id = :userID or cr.receiver_id = :userID
        `;

        let users = await this.usersRepository
        .createQueryBuilder("user")
        .where("user.id != :userID", {userID: data.userID})
        .andWhere(`user.id not in (${subQuery})`, {userID: data.userID})
        .select([
            "user.uuid as uuid",
            "user.username as username",
            "user.email as email"
        ])
        .take(limit)
        .skip((page - 1) * limit)
        .getRawMany();

        return users;  
    }
    async validarLogin(data: LoginUserDTO) : Promise<UsersEntity>{
        let user = await this.buscarUsuario({email: data.email});

        if(user == null || !(await bcryptjs.compare(data.password, user.password))){
            throw new Error("Email ou senha invalidos");
        } 

        return user;
    }
    async registrarUsuario(data: RegisterUserDTO) : Promise<UsersEntity>{
        let user = await this.buscarUsuario({email: data.email});
        console.log(data.email);

        if(user != null){
            throw new Error("Email já em uso");
        }

        let passwordHashed = await bcryptjs.hash(data.password, 10); 

        user = this.usersRepository.create({
            ...data,
            password: passwordHashed,
            uuid: uuidv4()
        });

        return await this.usersRepository.save(user);
    }
    async buscarUsuario(user: BuscarUsuarioDTO){
        return this.usersRepository.findOne({where: user});
    }
}
