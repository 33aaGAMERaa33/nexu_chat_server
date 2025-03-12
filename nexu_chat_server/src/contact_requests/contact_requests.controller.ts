import { Body, Controller, Headers, HttpException, HttpStatus, Post } from '@nestjs/common';
import { ContactRequestsService } from './contact_requests.service';
import { TokenService } from 'src/token/token.service';
import { ChatGateway } from 'src/chat/chat.gateway';
import { UsersService } from 'src/users/users.service';
import { ContactRequestStatus } from './contact_requests.entity';

@Controller('contact-requests')
export class ContactRequestsController {
    constructor(
        private readonly contactRequestsService: ContactRequestsService,    
        private readonly tokenService: TokenService,    
    ) {}
    @Post("enviar-pedido-contato")
    async enviarPedidoContato(@Body() body, @Headers("authorization") authHeader: string){
        const id = body.id;
        const token = this.tokenService.extractToken(authHeader);
        const tokenValido = await this.tokenService.validateTokenSession(token ?? "");

        if(tokenValido instanceof HttpException){
            throw tokenValido;
        }

        let contactRequest = await this.contactRequestsService.enviarPedidoContato(tokenValido.id, body.id);

        return {
            "status": "success",
            "message": "Pedido de contato enviado",
        };
    }
    @Post("process_contact_request")
    async processarPedidoContato(@Body() body, @Headers("authorization") authHeader: string){
        const token = this.tokenService.extractToken(authHeader);
        const tokenValido = await this.tokenService.validateTokenSession(token ?? "", true);

        if(tokenValido instanceof HttpException){
            throw tokenValido;
        }

        if(body.id != null && body.status != null && body.status != ContactRequestStatus.pending){
            let pedidoContato = await this.contactRequestsService.pegarPedidoContatoPorId(body.id);

            if(pedidoContato != null && (pedidoContato.sender.id == tokenValido.id || pedidoContato.receiver.id == tokenValido.id)){

                try{
                    let pedidoProcessado = await this.contactRequestsService.processContactRequest(body.id, body.status);
                }catch(e){
                    throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
                }
                

                return {
                    "status": "success",
                    "message": "Pedido de contato processado"
                };
            }

            throw new HttpException("Pedido de contato não encontrado", HttpStatus.NOT_FOUND);
        }else{
            throw new HttpException("Argumento invalido", HttpStatus.BAD_REQUEST);
        }
    }

    @Post("obter-pedidos-contato-por-dados")
    async obterPedidosContatoPorDados(@Body() body, @Headers("authorization") authHeader: string){
        const token = this.tokenService.extractToken(authHeader);
        const tokenValido = await this.tokenService.validateTokenSession(token ?? "");

        if(tokenValido instanceof HttpException){
            throw tokenValido;
        }

        let idUser = tokenValido.id;
        let status = body.status;

        let pedidos = await this.contactRequestsService.pegarPedidosContatoUsuario(idUser, ContactRequestStatus.pending);

        return {
            "status": "success",
            "message": "Retornando pedindos de contato",
            "requests": pedidos
        }
    }
}
