import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { MessagePattern, Payload, RpcException } from '@nestjs/microservices';
import { LoginUserDto, RegisterUserDto } from './dto';
import { log } from 'console';
import { catchError } from 'rxjs';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('auth.register.user')
  registerUser(@Payload() registerUserDto: RegisterUserDto) {
    //return registerUserDto;
    return this.authService.registerUser(registerUserDto);
  }

  @MessagePattern('auth.login.user')
  loginUser(@Payload() loginUserDto: LoginUserDto) {
    return loginUserDto;
  //  return this.authService.loginUser(data);
  }

  @MessagePattern('auth.verify.user')
  verifyUser() {
    return 'verify user';
  //  return this.authService.verifyUser(data);
  }
}
