import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthModule } from 'src/auth/auth.module';
import { ContactRequestsEntity } from 'src/contact_requests/contact_requests.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UsersEntity,
            ContactRequestsEntity
        ]),
        AuthModule
    ],
    controllers: [UsersController],
    providers: [
        UsersService,
    ],
    exports: [
        UsersService
    ]
})
export class UsersModule {}
