import { Injectable, Logger } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CreateUserRequest } from './dtos/create-user.request';
import { UserCreatedEvent } from './events/user-created.event';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(private readonly eventEmitter: EventEmitter2) { }

  getHello (): string {
    return 'Hello World!';
  }

  async createUser (body: CreateUserRequest) {
    this.logger.log('Creating user', body);
    const userId = '123';
    this.eventEmitter.emit(
      'user.created',
      new UserCreatedEvent(userId, body.email),
    );
  }

  @OnEvent('user.created')
  welcomeNewUser (payload: UserCreatedEvent) {
    this.logger.log("welcoming new user", payload.email)
  }
  @OnEvent('user.created', { async: true })
  async sendWelcomeGift (payload: UserCreatedEvent) {
    this.logger.log("Sending welcome gift........ ", payload.email)
    await new Promise<void>((resolve) => setTimeout(() => resolve(), 3000))
    this.logger.log("Welcome gift sent........ ", payload.email)
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  deleteExpiredUsers () {
    this.logger.log("Deleting expired users");
  }

}
