import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ContactRequestsEntity, ContactRequestStatus } from './contact_requests.entity';
import { UsersService } from 'src/users/users.service';
import { ContactsEntity } from 'src/contacts/contacts.entity';
import { ContactsService } from 'src/contacts/contacts.service';
import { UsersEntity } from 'src/users/users.entity';
import { ChatGateway } from 'src/chat/chat.gateway';

@Injectable()
export class ContactRequestsService {
  constructor(
    @InjectRepository(ContactRequestsEntity)
    private contactRequestsRepository: Repository<ContactRequestsEntity>,
    @InjectRepository(UsersEntity)
    private usersRepository: Repository<UsersEntity>,
    @InjectDataSource()
    private readonly dataSource: DataSource,

    private readonly usersService: UsersService,
    private readonly contactsService: ContactsService,
  ) {}
  async enviarPedidoContato(remetente_id: number, destinatario_id: number){
    const rementente = await this.usersService.findOne({
      where: {id: remetente_id}
    });
    const destinatario = await this.usersService.findOne({
      where: {id: destinatario_id}
    });

    if(rementente == null || destinatario == null){
      const notFound: string = rementente == null ? "Rementente" : "Destinatario";

      throw new HttpException(`${notFound ?? "Not Found"} não encontrado`, HttpStatus.NOT_FOUND);
    }else if(await this.pegarPedidoContatoEntreUsuarios(remetente_id, destinatario_id) != null){
      throw new HttpException(`Pedido de contato já existente`, HttpStatus.NOT_IMPLEMENTED);
    }

    const contactRequest = this.contactRequestsRepository.create({
      sender: rementente,
      receiver: destinatario,
    });

    let destinatarioSocket = ChatGateway.getSocketByUserId(destinatario_id);

    if(destinatarioSocket != null){
      destinatarioSocket.emit("novo-pedido-contato", {
        id: rementente.id,
      });
    }

    return await this.contactRequestsRepository.save(contactRequest);
  }
  async processContactRequest(idRequest: number, status: ContactRequestStatus): Promise<void> {
    return await this.dataSource.transaction(async (manager) => {
      let contactRequest = await manager.findOne(ContactRequestsEntity, {
        where: {
          id: idRequest
        },
        relations: [
          "sender",
          "receiver"
        ]
      });

      if(contactRequest == null){
        throw new Error("Pedido de contato não encontrado");
      }else if(contactRequest.status == ContactRequestStatus.accepted){
        throw new Error("Não é mais possivel alterar o status deste pedido");
      }

      let update = await manager.update(ContactRequestsEntity, contactRequest.id, {status: status});

      await this.contactsService.criarContato(contactRequest.id);
    });
  }
  async pegarPedidosContatoUsuario(userId: string, status: ContactRequestStatus) {

    const pedidosContato = await this.contactRequestsRepository
      .createQueryBuilder("cr")
      .leftJoinAndSelect("cr.sender", "sender") // Carrega o remetente
      .where("cr.receiver = :userId", { userId }) // Filtra pelo destinatário
      .andWhere("cr.status = :status", { status }) // Filtra pelo status
      .select([
        "cr.id as request_id",
        "sender.id as id",
        "sender.username as username",
        "sender.email as email",
        "sender.created_at as created_at"
      ])
      .getRawMany(); // Retorna os dados brutos
  
    return pedidosContato;
  }
  
  async pegarPedidoContatoPorId(requestId: number){
    return await this.contactRequestsRepository.findOne({
      where: {
        id: requestId
      },
      relations: [
        "sender",
        "receiver"
      ]
    });
  }
  async pegarPedidoContatoEntreUsuarios(user1_id: number, user2_id: number){
    const contactRequest = await this.contactRequestsRepository
    .createQueryBuilder("request")
    .where("(request.sender = :id1 or request.receiver = :id1)", {id1: user1_id})
    .andWhere("(request.sender = :id2 or request.receiver = :id2)", {id2: user2_id})
    .getOne();

    return contactRequest;
  }
}