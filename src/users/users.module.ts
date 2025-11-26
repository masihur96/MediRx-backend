import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Patient } from './entities/patient.entity';
import { Doctor } from './entities/doctor.entity';
import { UsersService } from './users.service';
import { UserController } from './users.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Patient, Doctor])],
  providers: [UsersService],
  controllers: [UserController],
  exports: [UsersService],
})
export class UsersModule { }


