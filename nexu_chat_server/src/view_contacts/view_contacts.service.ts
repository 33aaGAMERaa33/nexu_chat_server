import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ViewContactsEntity } from './view_contacts.entity';
import { Repository } from 'typeorm';
import { ContactsStatus } from 'src/contacts/contacts.entity';

@Injectable()
export class ViewContactsService {
    constructor(
        @InjectRepository(ViewContactsEntity)
        public viewContactRepository: Repository<ViewContactsEntity>,
    ) {}

    async obterContatosDoUsuario(userId: number, status: ContactsStatus){
        let select = [
            "CASE WHEN sender_id = :userId THEN receiver_id ELSE sender_id END AS id",
            "CASE WHEN sender_id = :userId THEN receiver_username ELSE sender_username END AS username",
            "CASE WHEN sender_id = :userId THEN receiver_email ELSE sender_email END AS email",
            "status"
        ];

        let contatos = await this.viewContactRepository
        .createQueryBuilder("vc")
        .where("vc.sender_id = :userId or vc.receiver_id = :userId", {userId})
        .andWhere("vc.status = :status", {status})
        .select(select)
        .setParameter("userId", userId)
        .getRawMany();

        return contatos;
    }
}
