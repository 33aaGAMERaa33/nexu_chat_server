import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from 'src/users/users.entity';
import { TokenService } from './token.service';
import { AuthModule } from 'src/auth/auth.module';
import { UsersService } from 'src/users/users.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UsersEntity
        ]),
        AuthModule
    ],
    providers: [
        UsersService,
        TokenService,
    ],
    exports: [
        TokenService
    ]
})
export class TokenModule {

}
