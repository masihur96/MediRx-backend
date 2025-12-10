import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';

import { UsersService } from './users.service';

@ApiTags('users') // Required for Swagger
@Controller('users')
export class UserController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users' })
  getAll() {
    return this.usersService.findAllUsers();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user with role-based validation' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.createUser(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get Single user' })
  @ApiResponse({ status: 200, description: 'Object of users' })
  getProfile() {
    return this.usersService.findById('97b42916-fca6-4bb7-8078-64ab45a40e27'); // Example: Fetch user with ID 1
  }


  @Get('patients')
  @ApiOperation({ summary: 'Get all patients' })
  @ApiResponse({ status: 200, description: 'List of patients' })
  getAllPatients() {
    return this.usersService.findAllPatients();
  }



  @Get('doctors')
  @ApiOperation({ summary: 'Get all doctors' })
  @ApiResponse({ status: 200, description: 'List of doctors' })
  getAllDoctors() {
    return this.usersService.findAllDoctors();
  }

 
  @Get('admins')
  @ApiOperation({ summary: 'Get all admins' })
  @ApiResponse({ status: 200, description: 'List of admins' })
  getAllAdmins() {
    return this.usersService.findAllAdmins();
  }
}
