import { Injectable } from '@nestjs/common';
import { ContactsEntity, ContactsStatus } from './contacts.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { ViewContactsService } from 'src/view_contacts/view_contacts.service';
import { ContactRequestsEntity } from 'src/contact_requests/contact_requests.entity';

@Injectable()
export class ContactsService {
    constructor(
       @InjectRepository(ContactsEntity)
       private readonly contactsRepository: Repository<ContactsEntity>,
       @InjectDataSource()
       private readonly dataSource: DataSource,
       private readonly viewContactsService: ViewContactsService,
    ) {}
    
    async criarContato(idContactRequest: number) {
      return await this.dataSource.transaction(async (manager) => {
        const contactRequest = await manager.findOneBy(ContactRequestsEntity, { 
          id: idContactRequest 
        });
    
        if (!contactRequest) {
          throw new Error("Pedido de contato não encontrado");
        }
    
        // Cria o contato com a entidade relacionada
        const contact = manager.create(ContactsEntity, {
          contactRequest: contactRequest
        });
    
        console.log(contact);
        // Salva e retorna o contato
        return await manager.save(ContactsEntity, contact);
      });
    }

    async obterContatosDoUsuario(userId: number, status: ContactsStatus) {
      return await this.viewContactsService.obterContatosDoUsuario(userId, status);
    }
    
}
