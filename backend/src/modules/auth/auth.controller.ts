import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginRegisterDto } from './dto/login.register.dto';
import { AuthGuard } from './auth.guard';
import { User } from '../../domain/entities/user.entity';
import { UserService } from '../user/user.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
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
  async patchMe(
    @Req() request: { user: User },
    @Body() body: { color: string; avatarURL: string },
  ) {
    const user = await this.userService.update({
      pseudo: request.user.pseudo,
      password: request.user.password,
      ...body,
    });

    if (user instanceof Error) throw user;
    return user;
  }
}
