import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import {
  UserRepository,
  UserRepositoryProvider,
} from '../../domain/repositories/user.repository';
@Injectable()
export class UserService {
  constructor(
    @Inject(UserRepositoryProvider.provide)
    private readonly userRepository: UserRepository,
  ) {}

  async findByPseudo(pseudo: string) {
    return this.userRepository.findByPseudo(pseudo);
  }

  async create(user: {
    pseudo: string;
    password: string;
    color: string;
    avatarURL: string | null;
  }): Promise<User | Error> {
    const existingUser = await this.userRepository.findByPseudo(user.pseudo);
    if (existingUser) return new Error('Username already taken');
    return this.userRepository.create(user);
  }

  async update(user: {
    pseudo: string;
    password?: string;
    color?: string;
    avatarURL?: string | null;
  }): Promise<User | Error> {
    const existingUser = await this.userRepository.findByPseudo(user.pseudo);
    if (!existingUser) return new Error('User not found');
    return this.userRepository.update({ ...existingUser, ...user });
  }
}
