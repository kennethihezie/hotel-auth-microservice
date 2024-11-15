import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './model/schema/user.schema';
import { UserRepository } from './user.repository';
import { DatabaseModule } from 'microservice-app-library';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  imports: [
    DatabaseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  exports: [UsersService],
})
export class UsersModule {}
