import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/modules/user/user.service';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async authenticate(
    pseudo: string,
    plainPassword: string,
  ): Promise<{ access_token: string } | Error> {
    const user = await this.validateUser(pseudo, plainPassword);
    if (user instanceof Error) return user;
    return this.generateJWT(user);
  }

  private async validateUser(
    pseudo: string,
    plainPassword: string,
  ): Promise<User | Error> {
    const user = await this.userService.findByPseudo(pseudo);
    if (user && (await bcrypt.compare(plainPassword, user.password)))
      return user;
    return new Error('Invalid credentials');
  }

  private async generateJWT(
    user: User,
  ): Promise<{ user: Omit<User, 'password'>; access_token: string }> {
    const payload = { pseudo: user.pseudo };
    return {
      user: {
        pseudo: user.pseudo,
      },
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '1h',
      }),
    };
  }

  public async getUserFromJWT(jwt: string): Promise<User | Error> {
    try {
      const payload = await this.jwtService.verify(jwt, {
        secret: process.env.JWT_SECRET,
      });
      if (!payload) return new Error('Invalid token');
      const pseudo = payload['pseudo'];
      if (!pseudo) return new Error('No pseudo found in token');
      const user = await this.userService.findByPseudo(pseudo);
      if (!user) return new Error('User not found');
      return user;
    } catch (e) {
      return e;
    }
  }

  public async register(user: {
    pseudo: string;
    password: string;
  }): Promise<User | Error> {
    user.password = await bcrypt.hash(user.password, 10);
    const userCreated = await this.userService.create(user);
    if (userCreated instanceof Error) return user;
    return user;
  }
}
