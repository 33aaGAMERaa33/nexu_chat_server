import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessagesEntity, MessagesType } from './messages.entity';
import { Repository } from 'typeorm';
import { EnviarMensagemDTO } from './dto/enviar-mensagem.dto';
import { ViewContactsEntity } from 'src/contacts/view-contacts.entity';
import { UsersEntity } from 'src/users/users.entity';
import { ContactsEntity, ContactStatus } from 'src/contacts/contacts.entity';
import {v4 as uuidv4} from 'uuid';
import { ObterMensagensDto } from './dto/obter-mensagens.dto';
import { ViewMessagesEntity } from './view-messages.entity';

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(MessagesEntity)
        private readonly messagesRepository: Repository<MessagesEntity>,
        @InjectRepository(UsersEntity)
        private readonly usersRepository: Repository<UsersEntity>,
        @InjectRepository(ContactsEntity)
        private readonly contactsRepository: Repository<ContactsEntity>,
        @InjectRepository(ViewContactsEntity)
        private readonly viewContactsRepository: Repository<ViewContactsEntity>,
        @InjectRepository(ViewMessagesEntity)
        private readonly viewMessagesRepository: Repository<ViewMessagesEntity>,
    ){}

    async enviarMensagem(data: EnviarMensagemDTO){
        if(data.message.trim().length == 0){
            throw new HttpException("Mensagem não pode ser vazia", HttpStatus.BAD_REQUEST);
        }

        let sender = await this.usersRepository.findOneBy({id: data.userID});
        let receiver = await this.usersRepository.findOneBy({uuid: data.receiver_uuid});

        
        if(!sender || !receiver){
            throw new HttpException("Usuario não encontrado", HttpStatus.NOT_FOUND);
        }
        
        let viewContact = await this.viewContactsRepository
        .createQueryBuilder("vc")
        .innerJoin(UsersEntity, "sender", "sender.id = vc.sender_id")
        .innerJoin(UsersEntity, "receiver", "receiver.id = vc.receiver_id")
        .where("(sender.id = :senderID and receiver.id = :receiverID) or (sender.id = :receiverID and receiver.id = :senderID)")
        .setParameter("senderID", sender.id)
        .setParameter("receiverID", receiver.id)
        .getRawOne();

        
        if(!viewContact){
            throw new HttpException("Contato invalido", HttpStatus.BAD_REQUEST);
        }else if(viewContact.contato_status == ContactStatus.blocked){
            throw new HttpException("Contato bloqueado", HttpStatus.NOT_FOUND);
        }

        let contact = await this.contactsRepository.findOneBy({id: viewContact.vc_contact_id});

    
        let mensagem = this.messagesRepository.create({
            uuid: uuidv4(),
            contact: contact!,
            sender: sender,
            receiver: receiver,
            message: data.message,
            media_type: MessagesType.text,
        });

        return this.messagesRepository.save(mensagem);
    }
    async obterMensagens(data: ObterMensagensDto){
        let limit = data.pagination.limit ?? 50;
        let page = data.pagination.page ?? 1;

        limit = limit > 50 ? 50 : limit;
        page = page < 1 ? 1  : page;

        let mensagens = await this.viewMessagesRepository
        .createQueryBuilder("vmsg")
        .where("(vmsg.sender_id = :userID or vmsg.receiver_id = :userID)")
        .andWhere("vmsg.contact_uuid = :contactUUID")
        .select([
            "vmsg.contact_uuid as contact_uuid",
            "vmsg.sender_uuid as sender_uuid",
            "vmsg.sender_username as sender_username",
            "vmsg.sender_email as sender_email",
            "vmsg.message as message",
            "vmsg.type as type",
            "vmsg.sent_at as sent_at",
        ])
        .orderBy("vmsg.sent_at", 'DESC')
        .setParameter("userID", data.userID)
        .setParameter("contactUUID", data.contact_uuid)
        .take(limit)
        .skip((page - 1) * limit)
        .getRawMany();

        return mensagens;
    }
}
