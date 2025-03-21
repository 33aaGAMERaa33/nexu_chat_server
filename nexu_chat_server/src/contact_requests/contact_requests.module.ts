import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/users/users.entity';
import { ContactRequestsEntity } from './contact_requests.entity';
import { ContactRequestsService } from './contact_requests.service';
import { ContactRequestsController } from './contact_requests.controller';
import { AuthModule } from 'src/auth/auth.module';
import { ContactsEntity } from 'src/contacts/contacts.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UsersEntity,
            ContactRequestsEntity,
            ContactsEntity
        ]),
        AuthModule
    ],
    providers: [ContactRequestsService],
    controllers: [ContactRequestsController]
})
export class ContactRequestsModule {

}
