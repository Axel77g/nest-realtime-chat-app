import {
  Body,
  Controller,
  forwardRef,
  Get,
  Inject,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRegisterDto } from './dto/login.register.dto';
import { AuthGuard } from './auth.guard';
import { User } from '../../domain/entities/user.entity';
import { UserService } from '../user/user.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from '../file/file.service';
import { FileUploaded } from '../../domain/entities/fileUploaded.entity';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    @Inject('FileService') private fileService: FileService,
  ) {}

  //login route
  @Post('login')
  async login(@Body() body: LoginRegisterDto) {
    const { pseudo, password } = body;
    const response = await this.authService.authenticate(pseudo, password);
    if (response instanceof Error)
      throw new UnauthorizedException(response.message);
    return response;
  }

  //register route
  @Post('register')
  async register(@Body() body: LoginRegisterDto) {
    const response = await this.authService.register(body);
    if (response instanceof Error)
      throw new UnauthorizedException(response.message);
    return response;
  }

  @Get('me')
  @UseGuards(AuthGuard)
  async me(@Req() request: { user: User }) {
    return request.user;
  }

  @Patch('me')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  async patchMe(
    @Req() request: { user: User },
    @Body() body: { color: string; avatarURL?: string | null },
    @UploadedFile() fileUploaded: Express.Multer.File | undefined,
  ) {
    let file: FileUploaded | undefined | Error;
    if (fileUploaded) {
      file = await this.fileService.writeFile(fileUploaded, request.user);
      if (file instanceof Error) throw file;
      body.avatarURL = file.getURL();
    }
    const user = await this.userService.update({
      pseudo: request.user.pseudo,
      password: request.user.password,
      ...body,
    });

    if (user instanceof Error) throw user;
    return user;
  }
}
