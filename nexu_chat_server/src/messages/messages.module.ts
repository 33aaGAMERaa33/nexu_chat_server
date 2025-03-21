import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/users/users.entity';
import { ContactRequestsEntity } from 'src/contact_requests/contact_requests.entity';
import { ContactsEntity } from 'src/contacts/contacts.entity';
import { MessagesEntity } from './messages.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ViewContactsEntity } from 'src/contacts/view-contacts.entity';
import { ViewMessagesEntity } from './view-messages.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsersEntity,
      ContactRequestsEntity,
      ContactsEntity,
      MessagesEntity,
      ViewContactsEntity,
      ViewMessagesEntity
    ]),
    AuthModule
  ],
  providers: [MessagesService],
  controllers: [MessagesController]
})
export class MessagesModule {}
