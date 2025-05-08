import {
  IsArray,
  ArrayMinSize,
  ArrayUnique,
  ArrayMaxSize,
} from 'class-validator';

export class OpenConversationDto {
  @IsArray({
    message:
      'participantsPseudos must be an array of strings with at least 1 elements',
  })
  @ArrayMinSize(1, {
    message: 'participantsPseudos must contain at least 1 elements',
  })
  @ArrayMaxSize(10, {
    message: 'participantsPseudos must contain at most 10 elements',
  })
  @ArrayUnique({
    message: 'participantsPseudos must not contain duplicate values',
  })
  participantsPseudos: string[];
}
