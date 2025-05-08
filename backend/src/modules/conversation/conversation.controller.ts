import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { AuthGuard } from '../auth/auth.guard';
import { OpenConversationDto } from './dto/openConversation.dto';
import { ConversationInterceptor } from 'src/modules/conversation/conversation.interceptor';
import { ParticipationUpdateDto } from './dto/participationUpdate.dto';
import { User } from '../../domain/entities/user.entity';
import { Conversation } from '../../domain/entities/conversation.entity';

@Controller('conversations')
export class ConversationController {
  constructor(private conversationService: ConversationService) {
    this.conversationService = conversationService;
  }

  @Get()
  @UseGuards(AuthGuard)
  async getMyConversations(@Req() request: { user: User }) {
    const conversations =
      await this.conversationService.getParticipantConversations(
        request.user.pseudo,
      );

    const result = await this.conversationService.transformToViewedConversation(
      conversations,
      request.user,
    );
    if (result instanceof Error)
      throw new InternalServerErrorException(
        'Error while loading conversations',
      );

    return result;
  }

  @Post()
  @UseGuards(AuthGuard)
  async createConversation(
    @Body() body: OpenConversationDto,
    @Req() request: { user: User },
  ) {
    body.participantsPseudos.unshift(request.user.pseudo); // add the user to the participants at the beginning (admin user)
    return await this.conversationService.openConversation(body);
  }

  @Delete(':identifier')
  @UseGuards(AuthGuard)
  @UseInterceptors(ConversationInterceptor)
  async closeConversation(
    @Req() request: { conversation: Conversation; user: User },
  ) {
    const response = await this.conversationService.closeConversation(
      request.conversation.identifier,
      request.user.pseudo,
    );
    if (response instanceof Error) throw response;
    return response;
  }

  @Get(':identifier/join')
  @UseGuards(AuthGuard)
  @UseInterceptors(ConversationInterceptor)
  async joinConversation(
    @Req() request: { conversation: Conversation; user: User },
    @Body() body: ParticipationUpdateDto,
  ) {
    const response = await this.conversationService.joinConversation(
      request.conversation,
      body.participant,
    );
    if (response instanceof Error) throw response;
    return response;
  }

  @Get(':identifier/leave')
  @UseGuards(AuthGuard)
  @UseInterceptors(ConversationInterceptor)
  async leaveConversation(
    @Req() request: { conversation: Conversation; user: User },
    @Body() body: ParticipationUpdateDto,
  ) {
    const response = await this.conversationService.leaveConversation(
      request.conversation,
      body.participant,
    );
    if (response instanceof Error) throw response;
    return response;
  }
}
