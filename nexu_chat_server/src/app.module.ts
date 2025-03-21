import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersEntity } from './users/users.entity';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { ChatGateway } from './chat/chat.gateway';
import { ContactRequestsEntity } from './contact_requests/contact_requests.entity';
import { ContactRequestsModule } from './contact_requests/contact_requests.module';
import { ContactsEntity } from './contacts/contacts.entity';
import { ContactsModule } from './contacts/contacts.module';
import { ViewContactRequestsEntity } from './contact_requests/view-contact-requests.entity';
import { ViewContactsEntity } from './contacts/view-contacts.entity';
import { MessagesEntity } from './messages/messages.entity';
import { MessagesModule } from './messages/messages.module';
import { ViewMessagesEntity } from './messages/view-messages.entity';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database: 'nexu_chat',
      entities: [
        UsersEntity,
        ContactRequestsEntity,
        ContactsEntity,
        MessagesEntity,
        ViewContactRequestsEntity,
        ViewContactsEntity,
        ViewMessagesEntity
      ],
      synchronize: true,
    }),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    AuthModule,
    UsersModule,
    ContactRequestsModule,
    ContactsModule,
    MessagesModule,
    ChatModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService,
  ],
})
export class AppModule {}
