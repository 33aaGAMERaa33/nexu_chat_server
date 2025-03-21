import { Body, Controller, HttpException, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { ContactsService } from './contacts.service';
import { ObterContatosDTO } from './dto/obter-contatos.dto';

@Controller('contacts')
export class ContactsController {
    constructor(
        private readonly contactsService: ContactsService,
        private readonly authService: AuthService,
    ) {}

    @Post("obter-contatos")
    @UseGuards(AuthGuard("jwt"))
    async obterContatos(@Body() data: ObterContatosDTO, @Request() req){
        const token = req.headers.authorization?.replace('Bearer ', '');
        const tokenValido = await this.authService.decodeToken(token);

        try{
            let contatos = await this.contactsService.obterContatos({
                ...data,
                userID: tokenValido.id
            });

            return {
                "status": "success",
                "message": "Retorno de contatos",
                "contatos": contatos ?? [],
            };
        }catch(e){
            throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
        }
    }
}
