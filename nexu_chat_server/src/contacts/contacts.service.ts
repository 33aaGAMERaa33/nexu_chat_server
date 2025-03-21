import { Injectable } from '@nestjs/common';
import { ObterContatosDTO } from './dto/obter-contatos.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ContactsEntity } from './contacts.entity';
import { Repository } from 'typeorm';
import { ViewContactsEntity } from './view-contacts.entity';

@Injectable()
export class ContactsService {
    constructor(
        @InjectRepository(ContactsEntity)
        private readonly contactsRepository: Repository<ContactsEntity>,
        @InjectRepository(ViewContactsEntity)
        private readonly viewContactsRepository: Repository<ViewContactsEntity>
    ) {}

    async obterContatos(data: ObterContatosDTO){
        let limit = data.pagination.limit ?? 50;
        let page = data.pagination.page ?? 1;

        limit = limit > 50 ? 50 : limit;
        page = page < 1 ? 1 : page;

        let contatos = await this.viewContactsRepository
        .createQueryBuilder("vc")
        .where("(vc.sender_id = :userID or vc.receiver_id = :userID)")
        .andWhere("vc.contact_status = :status")
        .select([
            "case when vc.sender_id = :userID then receiver_uuid else sender_uuid end as uuid",
            "case when vc.sender_id = :userID then receiver_username else sender_username end as username",
            "case when vc.sender_id = :userID then receiver_email else sender_email end as email",
            "vc.contact_status as status",
            "vc.contact_uuid as contact_uuid",
        ])
        .take(limit)
        .skip((page - 1) * limit)
        .setParameter("userID", data.userID)
        .setParameter("status", data.status)
        .getRawMany();

        return contatos;
    }
}
