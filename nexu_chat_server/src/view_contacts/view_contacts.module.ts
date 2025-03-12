import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ViewContactsEntity } from './view_contacts.entity';
import { ViewContactsService } from './view_contacts.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ViewContactsEntity
        ])
    ],
    providers: [ViewContactsService],
    exports: [
        ViewContactsService
    ]
})
export class ViewContactsModule {}
