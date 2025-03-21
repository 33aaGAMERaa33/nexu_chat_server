import { Module } from '@nestjs/common';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/users/users.entity';
import { ContactsEntity } from './contacts.entity';
import { ContactRequestsEntity } from 'src/contact_requests/contact_requests.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ViewContactRequestsEntity } from 'src/contact_requests/view-contact-requests.entity';
import { ViewContactsEntity } from './view-contacts.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsersEntity,
      ContactRequestsEntity,
      ContactsEntity,
      ViewContactRequestsEntity,
      ViewContactsEntity
    ]),
    AuthModule
  ],
  controllers: [ContactsController],
  providers: [ContactsService]
})
export class ContactsModule {}
