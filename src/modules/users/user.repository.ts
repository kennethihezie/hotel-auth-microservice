import { User } from './model/schema/user.schema';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseRepository } from 'microservice-app-library';
import { Model } from 'mongoose';

export class UserRepository extends BaseRepository<User> {
  protected logger: Logger = new Logger(UserRepository.name);

  constructor(@InjectModel(User.name) protected readonly model: Model<User>) {
    super(model);
  }
}
