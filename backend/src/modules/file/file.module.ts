import { forwardRef, Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { FileServiceProvider } from './file.service';
import { FileRepositoryProvider } from '../../domain/repositories/file.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { FileUploadedSchema } from '../../infrastructure/mongo/fileUploaded.schema';
import { AuthModule } from '../auth/auth.module';
import { UserSchema } from '../../infrastructure/mongo/user.schema';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'FileUploaded', schema: FileUploadedSchema },
    ]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    forwardRef(() => AuthModule),
    MulterModule.register({
      dest: '/tmp/uploads',
    }),
  ],
  controllers: [FileController],
  providers: [FileServiceProvider, FileRepositoryProvider],
  exports: [FileServiceProvider],
})
export class FileModule {}
