import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
// import { CreatePatientDto } from './dto/create-patient.dto';
// import { CreateDoctorDto } from './dto/create-doctor.dto';
// import { CreateAdminDto } from './dto/create-admin.dto';
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

  // @Post('patients')
  // @ApiOperation({ summary: 'Register a new patient' })
  // @ApiResponse({ status: 201, description: 'Patient registered successfully' })
  // createPatient(@Body() createPatientDto: CreatePatientDto) {
  //   return this.usersService.createPatient(createPatientDto);
  // }

  @Get('patients')
  @ApiOperation({ summary: 'Get all patients' })
  @ApiResponse({ status: 200, description: 'List of patients' })
  getAllPatients() {
    return this.usersService.findAllPatients();
  }

  // @Post('doctors')
  // @ApiOperation({ summary: 'Register a new doctor' })
  // @ApiResponse({ status: 201, description: 'Doctor registered successfully' })
  // createDoctor(@Body() createDoctorDto: CreateDoctorDto) {
  //   return this.usersService.createDoctor(createDoctorDto);
  // }

  @Get('doctors')
  @ApiOperation({ summary: 'Get all doctors' })
  @ApiResponse({ status: 200, description: 'List of doctors' })
  getAllDoctors() {
    return this.usersService.findAllDoctors();
  }

  // @Post('admins')
  // @ApiOperation({ summary: 'Register a new admin' })
  // @ApiResponse({ status: 201, description: 'Admin registered successfully' })
  // createAdmin(@Body() createAdminDto: CreateAdminDto) {
  //   return this.usersService.createAdmin(createAdminDto);
  // }

  @Get('admins')
  @ApiOperation({ summary: 'Get all admins' })
  @ApiResponse({ status: 200, description: 'List of admins' })
  getAllAdmins() {
    return this.usersService.findAllAdmins();
  }
}
