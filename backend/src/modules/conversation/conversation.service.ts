import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { UserService } from '../user/user.service';
import { OpenConversationDto } from './dto/openConversation.dto';
import {
  ConversationRepository,
  ConversationRepositoryProvider,
} from '../../domain/repositories/conversation.repository';
import {
  Conversation,
  ConversationUserViewed,
} from '../../domain/entities/conversation.entity';
import { User } from '../../domain/entities/user.entity';

// Create an enum for conversation actions
enum ConversationAction {
  JOIN = 'join',
  LEAVE = 'leave',
}

@Injectable()
export class ConversationService {
  constructor(
    @Inject(ConversationRepositoryProvider.provide)
    private conversationRepository: ConversationRepository,
    private userService: UserService,
  ) {}

  async getParticipantConversations(participantPseudo: string) {
    return this.conversationRepository.getParticipantConversations(
      participantPseudo,
    );
  }

  async transformToViewedConversation(
    input: Conversation,
    user: User,
  ): Promise<Error | ConversationUserViewed>;
  async transformToViewedConversation(
    input: Conversation[],
    user: User,
  ): Promise<Error | ConversationUserViewed[]>;
  async transformToViewedConversation(
    input: Conversation | Conversation[],
    user: User,
  ): Promise<Error | ConversationUserViewed | ConversationUserViewed[]> {
    if (Array.isArray(input)) {
      const result: ConversationUserViewed[] = [];
      for (const c of input) {
        const response = await this.transformToViewedConversation(c, user);
        if (response instanceof Error) return response;
        result.push(response);
      }
      return result;
    }

    const unreadMessagesCount =
      await this.conversationRepository.countUnreadMessages(input, user.pseudo);

    const lastMessage = await this.conversationRepository.getLastMessage(input);

    const viewedConversation: ConversationUserViewed = {
      ...input,
      unreadCount: unreadMessagesCount,
      lastMessage: lastMessage?.content ?? null,
      lastMessageDate: lastMessage?.date ?? null,
    };

    return viewedConversation;
  }

  async participantIsInConversation(
    conversation: Conversation,
    participantPseudo: string,
  ): Promise<Error | boolean> {
    if (
      !conversation.participants.some(
        (participant) => participant.pseudo == participantPseudo,
      )
    )
      return new Error('User not in conversation');
    return true;
  }

  async getConversationByIdentifier(
    identifier: string,
  ): Promise<Conversation | Error> {
    const conversation =
      await this.conversationRepository.getConversationByIdentifier(identifier);
    if (!conversation) return new NotFoundException('Conversation not found');
    if (conversation.closed)
      return new BadRequestException('Conversation already closed');
    return conversation;
  }

  /**
   * Open a new conversation with the given participants the array is already checked
   * to contain more than 1 participant and not duplicate participants
   */
  async openConversation(
    { participantsPseudos }: OpenConversationDto,
    connectedUser: User,
  ): Promise<Conversation | Error> {
    participantsPseudos.unshift(connectedUser.pseudo); // add the user to the participants at the beginning (admin user)
    for (const pseudo of participantsPseudos) {
      const user = await this.userService.findByPseudo(pseudo);
      if (!user)
        return new NotFoundException(
          `User with pseudo ${pseudo} does not exist`,
        );
    }

    const uniqueParticipantsPseudos = [...new Set(participantsPseudos)];
    if (uniqueParticipantsPseudos.length == 1)
      //case when the user select himself
      return new BadRequestException(
        'Cannot create a conversation with one user',
      );

    const existingConversation =
      await this.conversationRepository.getConversationByParticipants(
        uniqueParticipantsPseudos,
      );
    if (existingConversation) {
      return new BadRequestException(
        'The conversation already exist and is opened',
      );
    }

    const nameArray = [...uniqueParticipantsPseudos];
    nameArray.shift();

    const conversation = {
      identifier: crypto.randomUUID(),
      participants: uniqueParticipantsPseudos,
      name: nameArray.join(', '),
      lastMessageDate: new Date(),
      closed: false,
    };

    const response =
      await this.conversationRepository.putConversation(conversation);
    if (!response)
      return new InternalServerErrorException(
        'Error while opening conversation',
      );
    const conversationResponse = await this.getConversationByIdentifier(
      conversation.identifier,
    );
    if (conversationResponse instanceof Error) return conversationResponse;
    return conversationResponse;
  }

  async closeConversation(
    conversationIdentifier: string,
    intentedClosingParticipant: string,
  ) {
    const conversation =
      await this.conversationRepository.getConversationByIdentifier(
        conversationIdentifier,
      );
    if (conversation instanceof Error) return conversation;
    if (conversation.participants[0].pseudo !== intentedClosingParticipant)
      return new UnauthorizedException(
        'You are not the admin of this conversation',
      );
    conversation.closed = true;
    const reponse =
      await this.conversationRepository.putConversation(conversation);
    if (!reponse)
      return new InternalServerErrorException(
        'Error while closing conversation',
      );
    return conversation;
  }

  async leaveConversation(
    conversation: Conversation,
    participantPseudo: string,
  ) {
    return this.updateParticipation(
      conversation,
      participantPseudo,
      ConversationAction.LEAVE,
    );
  }

  async joinConversation(
    conversation: Conversation,
    participantPseudo: string,
  ) {
    return this.updateParticipation(
      conversation,
      participantPseudo,
      ConversationAction.JOIN,
    );
  }

  private async updateParticipation(
    conversation: Conversation,
    participantPseudo: string,
    action: ConversationAction,
  ): Promise<Conversation | Error> {
    const user = await this.userService.findByPseudo(participantPseudo);

    if (action === ConversationAction.JOIN) {
      if (conversation.participants.some((u) => u.pseudo == participantPseudo))
        return new BadRequestException('User already in conversation');
      conversation.participants.push(user);
    } else if (action === ConversationAction.LEAVE) {
      if (!conversation.participants.some((u) => u.pseudo == participantPseudo))
        return new BadRequestException('User not in conversation');
      conversation.participants = conversation.participants.filter(
        (u) => u.pseudo !== participantPseudo,
      );
    }

    const response =
      await this.conversationRepository.putConversation(conversation);
    if (!response)
      return new InternalServerErrorException(
        `Error while ${action.toLowerCase()}ing conversation`,
      );
    return conversation;
  }

  /**
   * Mark the conversation as read by the given user
   */
  async markAsRead(
    conversation: Conversation,
    user: User,
  ): Promise<true | Error> {
    const result = await this.conversationRepository.markAsRead(
      conversation,
      user.pseudo,
    );
    if (!result)
      return new InternalServerErrorException(
        'Error while marking conversation as read',
      );
    return true;
  }
}
