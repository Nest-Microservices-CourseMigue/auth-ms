import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaClient } from '@prisma/client';
import { RegisterUserDto } from './dto';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('AuthService');

  onModuleInit() {
    this.$connect();
    this.logger.log('Connected to MongoDB');
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
          password: registerUserDto.password,
        },
      });

      return { user: newUser, token: "ABC" };
    } catch (error) {
      throw new RpcException({
        status: 400,
        message: error.message,
      });
    }
  }
}
