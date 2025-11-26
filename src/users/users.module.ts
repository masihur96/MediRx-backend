import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';  // <-- THIS PATH MUST BE CORRECT
import { UsersService } from './users.service';
import { UserController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
   controllers: [UserController],
  exports: [UsersService],
})
export class UsersModule {}


