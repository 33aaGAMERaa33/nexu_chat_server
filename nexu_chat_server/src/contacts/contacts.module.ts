import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactsEntity } from './contacts.entity';
import { ContactsController } from './contacts.controller';
import { UsersEntity } from 'src/users/users.entity';
import { TokenService } from 'src/token/token.service';
import { UsersService } from 'src/users/users.service';
import { AuthModule } from 'src/auth/auth.module';
import { ViewContactsEntity } from 'src/view_contacts/view_contacts.entity';
import { ViewContactsService } from 'src/view_contacts/view_contacts.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ContactsEntity,
      ViewContactsEntity,
      UsersEntity
    ]),
    AuthModule
  ],
  providers: [
    ContactsService,
    TokenService,
    UsersService,
    ViewContactsService
  ],
  controllers: [
    ContactsController
  ],
})
export class ContactsModule {}
