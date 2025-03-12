import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TokenService } from 'src/token/token.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private static users = new Map<number, Socket>();

  constructor(
    private readonly tokenService: TokenService
  ) {}

  async  handleConnection(client: Socket) {
    const token = client.handshake.query["token"];
    const tokenValido = await this.tokenService.validateTokenSession(token as string);

    if (tokenValido) {
      console.log(`Cliente connectado: ${client.id} (UserID: ${tokenValido.id})`);
      ChatGateway.users.set(tokenValido.id, client);
    } else {
      client.disconnect();
    }
  }
  
  async handleDisconnect(client: Socket) {
    const userId = ChatGateway.getUserIdBySocket(client);

    if (userId) {
      ChatGateway.users.delete(userId);
      console.log(`Cliente desconectado: ${client.id} (UserID: ${userId})`);
    }
  }
  public static getSocketByUserId(userId: number) : Socket | undefined{
    let socket = this.users.get(userId);

    return socket;
  }
  public static getUserIdBySocket(client: Socket): number | undefined {
    for (const [userId, socket] of ChatGateway.users.entries()) {
      if (socket.id === client.id) {
        return userId;
      }
    }
    return undefined;
  }
}
