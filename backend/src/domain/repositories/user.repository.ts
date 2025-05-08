import { MongoUserRepository } from 'src/infrastructure/mongo/user.repository';
import { User } from '../entities/user.entity';

export interface UserRepository {
  findByPseudo(pseudo: string): Promise<User | null>;
  create(user: User): Promise<User>;
  update(user: User): Promise<User>;
  delete(id: string): Promise<boolean>;
}

export const UserRepositoryProvider = {
  provide: 'UserRepository',
  useClass: MongoUserRepository,
};
