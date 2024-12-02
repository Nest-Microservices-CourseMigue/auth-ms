import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern } from '@nestjs/microservices';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth.register.user')
  registerUser() {
    return 'register user';
  //  return this.authService.registerUser(data);
  }

  @MessagePattern('auth.login.user')
  loginUser() {
    return 'login user';
  //  return this.authService.loginUser(data);
  }

  @MessagePattern('auth.verify.user')
  verifyUser() {
    return 'verify user';
  //  return this.authService.verifyUser(data);
  }
}
