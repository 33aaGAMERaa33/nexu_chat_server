import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactRequestsEntity } from './contact_requests.entity';
import { ContactRequestsService } from './contact_requests.service';
import { ContactRequestsController } from './contact_requests.controller';
import { TokenService } from 'src/token/token.service';
import { UsersEntity } from 'src/users/users.entity';
import { ChatGateway } from 'src/chat/chat.gateway';
import { UsersService } from 'src/users/users.service';
import { AuthModule } from 'src/auth/auth.module';
import { ContactsEntity } from 'src/contacts/contacts.entity';
import { ContactsService } from 'src/contacts/contacts.service';
import { ViewContactsEntity } from 'src/view_contacts/view_contacts.entity';
import { ViewContactsService } from 'src/view_contacts/view_contacts.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ContactRequestsEntity,
            ContactsEntity,
            UsersEntity,
            ViewContactsEntity
        ]),
        AuthModule
    ],
    providers: [
        ContactRequestsService,
        TokenService,
        UsersService,
        ChatGateway,
        ContactsService,
        ViewContactsService
    ],
    controllers: [
        ContactRequestsController
    ],
    exports: [
        
    ]
})
export class ContactRequestsModule {}
