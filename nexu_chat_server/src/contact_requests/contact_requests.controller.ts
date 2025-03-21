import { Body, Controller, HttpException, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { EnviarPedidoContatoDTO as EnviarPedidoContatoDTO } from './dto/enviar-pedido-contato.dto';
import { ContactRequestsService } from './contact_requests.service';
import { AuthService } from 'src/auth/auth.service';
import { ObterPedidosContatoDTO } from './dto/obter-pedidos-contato.dto';
import { ProcessarPedidoContatoDTO } from './dto/processar-pedido-contato.dto';

@Controller('contact-requests')
export class ContactRequestsController {
    constructor(
        private readonly contactRequestsService: ContactRequestsService,
        private readonly authService: AuthService,
    ) {}
    @Post("processar-pedido-contato")
    @UseGuards(AuthGuard("jwt"))
    async processarPedidoContato(@Body() data: ProcessarPedidoContatoDTO, @Request() req){ 
        const token = req.headers.authorization?.replace('Bearer ', '');
        const tokenValido = await this.authService.decodeToken(token);

        try{
            await this.contactRequestsService.processarPedidoContato({
                ...data,
                userID: tokenValido.id
            });

            return {
                "status": "success",
                "message": "Pedido contato processado"
            };
        }catch(e){
            throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
        }
    }
    @Post("enviar-pedido-contato")
    @UseGuards(AuthGuard("jwt"))
    async enviarPedidoContato(@Body() data: EnviarPedidoContatoDTO, @Request() req) {
        const token = req.headers.authorization?.replace('Bearer ', '');
        const tokenValido = await this.authService.decodeToken(token);
        
        try{
            await this.contactRequestsService.enviarPedidoContato({
                ...data,
                userID: tokenValido.id
            });
        }catch(e){
            throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
        }
        
        return {
            "status": "success",
            "message": "Pedido enviado",
        };
    }
    @Post("obter-pedidos-contato")
    @UseGuards(AuthGuard("jwt"))
    async obterPedidosContato(@Body() data: ObterPedidosContatoDTO, @Request() req){
        const token = req.headers.authorization?.replace('Bearer ', '');
        const tokenValido = await this.authService.decodeToken(token);
        
        try{
            let pedidosContato = await this.contactRequestsService.obterPedidosContato({
                ...data,
                userID: tokenValido.id
            });

            return {
                "status": "success",
                "message": "Retorno de pedidos",
                "pedidos": pedidosContato
            };
        }catch(e){
            throw new HttpException(e.message, HttpStatus.BAD_REQUEST);
        }
    }
}
