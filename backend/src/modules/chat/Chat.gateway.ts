import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../auth/auth.service';
import { Conversation } from '../../domain/entities/conversation.entity';

export enum ChatEvent {
  READ_UPDATE = 'readUpdate',
  NEW_UPDATE_MESSAGE = 'newUpdate',
  TYPING_UPDATE = 'typingUpdate',
}

@WebSocketGateway(3001, {
  namespace: 'chat',
  cors: {
    origin: '*',
  },
})
export class ChatGateway {
  constructor(private readonly authService: AuthService) {}

  @WebSocketServer()
  server: Server;
  async handleConnection(client: Socket) {
    const token = client.handshake.query.token as string;
    if (!token) {
      client.disconnect();
      return;
    }

    const userResult = await this.authService.getUserFromJWT(token);
    if (userResult instanceof Error) {
      console.error(userResult);
      client.disconnect();
      return;
    }
    client.join(userResult.pseudo);
  }

  @SubscribeMessage(ChatEvent.TYPING_UPDATE)
  async handleTypingUpdate(
    @MessageBody()
    body: {
      conversation: Conversation;
      author: {
        pseudo: string;
      };
      typing: boolean;
    },
  ) {
    this.broadcastUpdateToConversation(
      body.conversation,
      body.author,
      ChatEvent.TYPING_UPDATE,
      { typing: body.typing },
    );
  }

  broadcastUpdateToConversation(
    conversation: Conversation,
    excludedUser?: { pseudo: string },
    event: ChatEvent = ChatEvent.NEW_UPDATE_MESSAGE,
    data?: any,
  ) {
    for (const user of conversation.participants) {
      if (user.pseudo === excludedUser?.pseudo) continue;
      this.server.to(user.pseudo).emit(event, {
        conversation: conversation,
        data: data,
      });
    }
  }
}
