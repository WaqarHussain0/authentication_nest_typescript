import { Body, Controller, Post, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  signIn(@Body() validateUserDto: any) {
    return this.authService.signIn(validateUserDto);
  }
}
