import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserModule } from 'src/modules/user/user.module';
import { AuthGuard } from './auth.guard';
import { FileModule } from '../file/file.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  providers: [AuthService, JwtService, AuthGuard],
  controllers: [AuthController],
  imports: [
    JwtModule.register({
      global: true,
      secret: 'secret',
      signOptions: { expiresIn: '1h' },
    }),
    UserModule,
    FileModule,
    MulterModule.register({
      dest: '/tmp/uploads',
    }),
  ],
  exports: [AuthGuard, AuthService],
})
export class AuthModule {}
