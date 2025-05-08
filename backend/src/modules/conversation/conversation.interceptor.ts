import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { ConversationService } from 'src/modules/conversation/conversation.service';
import { User } from '../../domain/entities/user.entity';

/**
 * ConversationInterceptor is used to check if the user is a participant of the conversation
 * And to add the conversation to the request object
 */
@Injectable()
export class ConversationInterceptor implements NestInterceptor {
  constructor(private readonly conversationService: ConversationService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const user: User = request.user;
    if (!user)
      throw new UnauthorizedException(
        'You must be logged in to access this resource',
      );
    const conversationIdentifier = request.params.conversationIdentifier;
    if (!conversationIdentifier)
      throw new BadRequestException(
        'Cannot retrive conversation without identifier',
      );
    const conversation =
      await this.conversationService.getConversationByIdentifier(
        conversationIdentifier,
      );
    if (conversation instanceof Error) throw conversation;
    const isParticipant =
      await this.conversationService.participantIsInConversation(
        conversation,
        user.pseudo,
      );
    if (isParticipant instanceof Error)
      throw new UnauthorizedException('You cannot access this conversation');
    request.conversation = conversation;
    return next.handle();
  }
}
