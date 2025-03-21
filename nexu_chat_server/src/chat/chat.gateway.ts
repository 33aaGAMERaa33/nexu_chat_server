import {
    WebSocketGateway,
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';

export enum MessageServerSocket {
    connectionStatus = "connection-status",
    newMessageReceived = "new-message-received"
}

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    // ✅ Agora `users` é um dicionário onde a chave é o UUID do usuário
    static users: Record<string, Socket> = {};

    constructor(
        private readonly authService: AuthService,
    ) {}

    async handleConnection(client: Socket) {
        const token = client.handshake.headers.authorization?.split("Bearer ")[1];
        const tokenValido = await this.authService.decodeToken(token as string);

        if (tokenValido) {
            client.data = tokenValido;
            ChatGateway.users[tokenValido.uuid] = client; // ✅ Armazena corretamente o usuário

            ChatGateway.enviarMensagemParaSocket(MessageServerSocket.connectionStatus, client, {
                "status": "success",
                "message": "Conexão aceita",
            });

            console.log("Cliente conectado: " + tokenValido.uuid);
        } else {
            ChatGateway.enviarMensagemParaSocket(MessageServerSocket.connectionStatus, client, {
                "status": "error",
                "message": "Token inválido",
            });

            client.disconnect();
        }
    }

    async handleDisconnect(client: Socket) {
        // ✅ Remove o usuário quando ele se desconectar
        const userUUID = client.data?.uuid;
        if (userUUID && ChatGateway.users[userUUID]) {
            delete ChatGateway.users[userUUID]; 
            console.log("Cliente desconectado: " + userUUID);
        }
    }

    static enviarMensagemParaUsuario(type: MessageServerSocket, userUUID: string, message: any) {
        let userSocket = ChatGateway.users[userUUID];

        if (userSocket) {
            userSocket.emit(type, message);
        }
    }

    static enviarMensagemParaSocket(type: MessageServerSocket, socket: Socket, message: any) {
        socket.emit(type, message);
    }
}
