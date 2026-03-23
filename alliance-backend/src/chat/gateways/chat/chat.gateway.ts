import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from '../../chat.service';
import { Message } from '../../schemas/message.schema'; // 1. Importamos el esquema

interface SendMessagePayload {
  senderId: string;
  receiverId: string;
  content: string;
}

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  @SubscribeMessage('join')
  handleJoin(
    @MessageBody() userId: string,
    @ConnectedSocket() client: Socket,
  ): void {
    client.join(userId);
    console.log(`Cliente unido a sala: ${userId}`);
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @MessageBody() payload: SendMessagePayload,
  ): Promise<Message> {
    // 2. Le decimos a TS que el resultado es de tipo Message
    const savedMessage: Message = await this.chatService.saveMessage(
      payload.senderId,
      payload.receiverId,
      payload.content,
    );

    // 3. Emitimos al receptor en tiempo real
    this.server.to(payload.receiverId).emit('newMessage', savedMessage);

    return savedMessage;
  }
}
