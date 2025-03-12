
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { UsersEntity } from './users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ObterUsuariosDto } from './dto/obter-usuarios.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    public usersRepository: Repository<UsersEntity>,
  ) {}

  findAll(): Promise<UsersEntity[]> {
    return this.usersRepository.find();
  }

  // pega os usuarios que nao tem o contato registrado ao usuario
  async obterUsersNaoRelacionadosAoUser(data: ObterUsuariosDto, userId: number, limit: number = 50) {
    const uuid = data.uuid ?? "";
    const username = data.username ?? "";
    const email = data.email ?? "";
    const page = data.page ?? 1;

    let escapedEmail = email.replace(/[%_]/g, "\\$&");

    const subQuery = `
        SELECT cr.sender FROM contact_requests cr WHERE cr.receiver = :userId
        UNION ALL
        SELECT cr.receiver FROM contact_requests cr WHERE cr.sender = :userId
    `;

    const usuarios = await this.usersRepository
        .createQueryBuilder("user")
        .where("user.id != :userId", { userId })
        .andWhere("user.email LIKE :email", { email: `%${escapedEmail}%` })
        .andWhere(`user.id NOT IN (${subQuery})`, { userId })  // Aqui está a correção
        .orderBy("user.email", "ASC")
        .skip((page - 1) * limit)
        .take(limit)
        .getMany();
        
    return { usuarios, page };
}

  
  async findOne(data: FindOneOptions<UsersEntity>): Promise<UsersEntity | null> {
    return await this.usersRepository.findOne(data);
  }

  async create(createUserDto: CreateUserDto): Promise<UsersEntity> {
    const userEntity = this.usersRepository.create({
      username: createUserDto.username,
      email: createUserDto.email,
      password: createUserDto.password,
    });
  
    return await this.usersRepository.save(userEntity); // Agora a entidade é salva no BD
  }
  async update(id: number, data: UpdateUserDto): Promise<boolean> {
    const result = await this.usersRepository.update(id, data);

    return result.affected === 1;
  }
}
