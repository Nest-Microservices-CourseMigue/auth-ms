import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { LoginUserDto, RegisterUserDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { envs } from '../config';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('AuthService');

  constructor(private readonly jwtService: JwtService) {
    super();
  }

  onModuleInit() {
    this.$connect();
    this.logger.log('Connected to MongoDB');
  }

  async signJWT(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  async registerUser(registerUserDto: RegisterUserDto) {
    try {
      const user = await this.user.findUnique({
        where: {
          email: registerUserDto.email,
        },
      });

      if (user) {
        throw new RpcException({
          status: 400,
          message: 'User already exists',
        });
      }

      const newUser = await this.user.create({
        data: {
          email: registerUserDto.email,
          name: registerUserDto.name,
          password: bcrypt.hashSync(registerUserDto.password, 10),
        },
      });

      const { password: __, ...rest } = newUser;

      return { user: rest, token: await this.signJWT(rest) };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    try {
      const user = await this.user.findUnique({
        where: {
          email: loginUserDto.email,
        },
      });

      if (!user) {
        throw new RpcException({
          status: 400,
          message: 'User/Password incorrect',
        });
      }

      const isPasswordValid = await bcrypt.compare(
        loginUserDto.password,
        user.password
      );

      if (!isPasswordValid) {
        throw new RpcException({
          status: 400,
          message: 'User/Password incorrect',
        });
      }

      const { password: __, ...rest } = user;

      return { user: rest, token: await this.signJWT(rest) };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }

  async verifyUser(token: string) {
    try {

      const { sub, iat, exp, ...user } = this.jwtService.verify(token, {
        secret: envs.jwtSecret,
      });

      return { user, token: await this.signJWT(user) };
    } catch (error) {
      throw new RpcException({
        status: 401,
        message: 'Invalid token',
      });
    }
  }
}
