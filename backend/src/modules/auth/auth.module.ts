import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { UserModule } from 'src/modules/user/user.module';
import { AuthGuard } from './auth.guard';

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
  ],
  exports: [AuthGuard, AuthService],
})
export class AuthModule {}
