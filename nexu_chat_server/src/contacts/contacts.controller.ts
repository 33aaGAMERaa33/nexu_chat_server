import { Body, Controller, Headers, HttpException, HttpStatus, Post } from '@nestjs/common';
import { TokenService } from 'src/token/token.service';
import { ContactsService } from './contacts.service';

@Controller('contacts')
export class ContactsController {
    constructor(
        private readonly contactsService: ContactsService,
        private readonly tokenService: TokenService,
    ) {
        
    }

    @Post("obter-contatos-por-dados")
    async obterContatosPorDados(@Body() body, @Headers("authorization") authHeader: string){
        const token = this.tokenService.extractToken(authHeader);
        const tokenValido = await this.tokenService.validateTokenSession(token ?? "");

        if(tokenValido instanceof HttpException){
            throw tokenValido;
        }

        let contatos = await this.contactsService.obterContatosDoUsuario(tokenValido.id, body.status);

        return {
            "status": "success",
            "message": "Retorno de contatos",
            "contatos": contatos
        };
    }
}
