import { IoAdapter } from '@nestjs/platform-socket.io';
import { Injectable, Next } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class WebSocketAdapter extends IoAdapter {
    constructor(
       private readonly configService: ConfigService 
    ) {
        super();
    }

    createIOServer(port: number, options?: any): Server {
    const webSocketPort = this.configService.get<number>("WEB_SOCKET_PORT");
    const server = super.createIOServer(webSocketPort!, options);

    server.use(async (socket: Socket, next) => {
        next(); 
    });

    return server;
  }
}
