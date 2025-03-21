import { Body, Controller, Get, HttpException, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { EnviarMensagemDTO } from './dto/enviar-mensagem.dto';
import { ObterMensagensDto } from './dto/obter-mensagens.dto';
import { ChatGateway, MessageServerSocket } from 'src/chat/chat.gateway';

@Controller('messages')
export class MessagesController {
    constructor(
        private readonly messagesService: MessagesService,
        private readonly authService: AuthService,
    ) {}
    @Post("enviar-mensagem")
    @UseGuards(AuthGuard("jwt"))
    async enviarMensagem(@Body() data: EnviarMensagemDTO, @Request() req){ 
        const token = req.headers.authorization?.replace('Bearer ', '');
        const tokenValido = await this.authService.decodeToken(token);

        let mensagem = await this.messagesService.enviarMensagem({
            ...data,
            userID: tokenValido.id
        });

        ChatGateway.enviarMensagemParaUsuario(MessageServerSocket.newMessageReceived, data.receiver_uuid, {
            sender: {
                uuid: tokenValido.uuid,
                username: tokenValido.username,
                email: tokenValido.email 
            },
            contact_uuid: mensagem.contact.uuid,
            message: mensagem.message,
            type: mensagem.media_type,
            sent_at: mensagem.sent_at
        });

        return {
            "status": "success",
            "message": "Mensagem enviada",
            "mensagem": {
                "message": mensagem.message,
                "type": mensagem.media_type,
                "sent_at": mensagem.sent_at,
            } ,
            "contact_uuid": mensagem.contact.uuid,
        };
    }
    @Post("obter-mensagens")
    @UseGuards(AuthGuard("jwt"))
    async obterMensagens(@Body() data: ObterMensagensDto, @Request() req){ 
        const token = req.headers.authorization?.replace('Bearer ', '');
        const tokenValido = await this.authService.decodeToken(token);

        let mensagens = await this.messagesService.obterMensagens({
            ...data,
            userID: tokenValido.id
        });

        return {
            "status": "success",
            "message": "Retorno de mensagens",
            "mensagens": mensagens
        };
    }
    
}
