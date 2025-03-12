import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './users/users.entity';
import { UsersModule } from './users/users.module';
import { JwtService } from '@nestjs/jwt';
import { AuthModule } from './auth/auth.module';
import { TokenModule } from './token/token.module';
import { ContactRequestsEntity } from './contact_requests/contact_requests.entity';
import { ContactRequestsModule } from './contact_requests/contact_requests.module';
import { ContactsModule } from './contacts/contacts.module';
import { ContactsEntity } from './contacts/contacts.entity';
import { ViewContactsEntity } from './view_contacts/view_contacts.entity';
import { ViewContactsModule } from './view_contacts/view_contacts.module';

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
        ViewContactsEntity
      ],
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    TokenModule,
    ContactRequestsModule,
    ContactsModule,
    ViewContactsModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService,
    JwtService,
  ],
})
export class AppModule {}
