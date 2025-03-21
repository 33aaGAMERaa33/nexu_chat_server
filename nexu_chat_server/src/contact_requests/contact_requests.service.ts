import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { ContactRequestsEntity, ContactRequestsStatus } from './contact_requests.entity';
import { DataSource, Repository } from 'typeorm';
import { EnviarPedidoContatoDTO } from './dto/enviar-pedido-contato.dto';
import { UsersEntity } from 'src/users/users.entity';
import { ObterPedidosContatoDTO } from './dto/obter-pedidos-contato.dto';
import {v4 as uuidv4} from 'uuid';
import { ProcessarPedidoContatoDTO } from './dto/processar-pedido-contato.dto';
import { ContactsEntity } from 'src/contacts/contacts.entity';

@Injectable()
export class ContactRequestsService {
    constructor(
        @InjectRepository(ContactRequestsEntity)
        private readonly contactRequestsRepository: Repository<ContactRequestsEntity>,
        @InjectRepository(UsersEntity)
        private readonly usersRepository: Repository<UsersEntity>,
        @InjectRepository(ContactsEntity)
        private readonly contactsRepository: Repository<ContactsEntity>,
        @InjectDataSource()
        private readonly dataSource: DataSource
    ) {}
    async processarPedidoContato(data: ProcessarPedidoContatoDTO){
        return this.dataSource.transaction(async (manager) => {
            let contactRequest = await manager.findOneBy(ContactRequestsEntity, {uuid: data.pedido_uuid});  
        
            if(!contactRequest){
                throw Error("Pedido de contato não encontrado");
            }else if(contactRequest.status == ContactRequestsStatus.accepted){
                throw Error("Não é possivel processar esse pedido");
            }else if(data.status == ContactRequestsStatus.pending){
                throw Error("Não é possivel alterar o status do pedido para o requerido");
            }
    
            let update = await manager.update(ContactRequestsEntity, contactRequest.id, {status: data.status});

            if(update.affected !== 1){
                throw Error("Não foi possivel processar esse pedido");
            }

            let contact = manager.create(ContactsEntity, {
                uuid: uuidv4(),
                contact_request: contactRequest
            });

            return await manager.save(ContactsEntity, contact);
        });
    }
    async enviarPedidoContato(data: EnviarPedidoContatoDTO){
        let sender = await this.usersRepository.findOne({
            where: {
                id: data.userID
            }
        });
        let receiver = await this.usersRepository.findOne({
            where: {
                uuid: data.receiver_uuid
            }
        });

        if(!sender || !receiver){
            throw Error("Usuario não encontrado");
        }else if(await this.pegarPedidoEntreUsuarios(sender.id, receiver.id)){
            throw Error("Pedido de contato já existe");
        }else if(sender.id == receiver.id){ 
            throw Error("Não é possivel enviar um pedido para si mesmo");
        }

        let contactRequest = this.contactRequestsRepository.create({
            sender: sender,
            receiver: receiver,
            uuid: uuidv4()
        });

        return await this.contactRequestsRepository.save(contactRequest);
    }
    async obterPedidosContato(data: ObterPedidosContatoDTO){
        let limit = data.pagination.limit ?? 50;
        let page = data.pagination.page ?? 1;

        limit = limit > 50 ? 50 : limit;
        page = page < 1 ? 1 : page;

        let pedidosContato = await this.contactRequestsRepository
        .createQueryBuilder("cr")
        .where("cr.receiver_id = :userID")
        .andWhere("cr.status = :status")
        .innerJoin(UsersEntity, "sender", "sender.id = cr.sender_id")
        .select([
            "sender.uuid as uuid",
            "sender.username as username",
            "sender.email as email",
            "cr.uuid as request_uuid",
            "cr.status as status",

        ])
        .take(limit)
        .skip((page - 1) * limit)
        .setParameter("userID", data.userID)
        .setParameter("status", data.request_status)
        .getRawMany();

        return pedidosContato;
    }
    async pegarPedidoEntreUsuarios(user1ID: number, user2ID: number): Promise<any | undefined>{
        let contactRequest = await this.contactRequestsRepository
        .createQueryBuilder("cr")
        .where("(cr.sender_id = :user1ID and cr.receiver_id = :user2ID)")
        .orWhere("(cr.sender_id = :user2ID and cr.receiver_id = :user1ID)")
        .setParameter("user1ID", user1ID)
        .setParameter("user2ID", user2ID)
        .getRawOne();

        return contactRequest;
    }
}
