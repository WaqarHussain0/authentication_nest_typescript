import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {
  }

  async signIn(validateUserDto: any): Promise<any> {    
    const user = await this.userService.validateUser(validateUserDto);
    if (user) {
      return user;
    }
    return null;
  }
}
