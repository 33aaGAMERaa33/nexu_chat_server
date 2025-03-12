import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from './users.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TokenService } from 'src/token/token.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UsersEntity
        ]),
        AuthModule,
    ],
    providers: [
        UsersService,
        TokenService,
    ],
    controllers: [UsersController],
    exports: [
        
    ],
})
export class UsersModule {}
