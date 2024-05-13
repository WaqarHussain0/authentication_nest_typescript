import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [
    UserModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.local.env' }),
  ],
})
export class AuthModule {}
