import { Controller, Get, Post, Req } from '@nestjs/common';

@Controller('session')
export class SessionController {
    @Post("obter-sessao")
    obterSessao(@Req() req){
        return req.session;
    }
}
