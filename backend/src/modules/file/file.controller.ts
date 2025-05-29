import { FileService } from './file.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Req,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { FileUploadedIdentifiable } from '../../domain/entities/fileUploaded.entity';
import { AuthGuard } from '../auth/auth.guard';
import { User } from '../../domain/entities/user.entity';

@Controller('files')
export class FileController {
  constructor(@Inject('FileService') private fileService: FileService) {}

  @Get(':identifier')
  async getFile(
    @Req() req: { user: User },
    @Param('identifier') identifier: string,
  ) {
    const response = await this.fileService.retrieveFile(identifier);
    if (response instanceof Error) throw response;
    const { stream, file } = response;
    return new StreamableFile(stream, { type: file.mimeType });
  }

  @Delete()
  @UseGuards(AuthGuard)
  async delete(
    @Body() fileUploadedIdentifiable: FileUploadedIdentifiable,
    @Req() req: { user: User },
  ) {
    const result = this.fileService.deleteFile(
      fileUploadedIdentifiable,
      req.user,
    );
    if (result instanceof Error) {
      throw result;
    }
    return {
      success: result,
      message: 'File deleted successfully',
    };
  }
}
