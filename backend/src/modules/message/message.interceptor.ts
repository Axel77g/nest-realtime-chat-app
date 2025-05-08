import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { MessageService } from './message.service';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class MessageInterceptor implements NestInterceptor {
  constructor(private readonly messageService: MessageService) {}

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
    const messageIdentifier = request.params.messageIdentifier;
    if (!messageIdentifier)
      throw new BadRequestException(
        'Cannot retrive message without identifier',
      );
    const message =
      await this.messageService.getMessageByIdentifier(messageIdentifier);
    if (message instanceof Error)
      throw new BadRequestException('Error while retrieving message');
    const isAuthor = await this.messageService.isAuthor(message, user.pseudo);
    if (!isAuthor)
      throw new UnauthorizedException('You cannot access this message');
    request.message = message;
    return next.handle();
  }
}
