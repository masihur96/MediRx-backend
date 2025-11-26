import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { CreatePatientDto } from './dto/create-patient.dto';
import { CreateDoctorDto } from './dto/create-doctor.dto';
import { UsersService } from './users.service';

@ApiTags('users') // Required for Swagger
@Controller('users')
export class UserController {
  constructor(private readonly usersService: UsersService) { }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users' })
  getAll() {
    return [{ id: 1, name: 'Masihur' }];
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  create(@Body() createUserDto: CreateUserDto) {
    return { message: 'User created', user: createUserDto };
  }

  @Post('patients')
  @ApiOperation({ summary: 'Register a new patient' })
  @ApiResponse({ status: 201, description: 'Patient registered successfully' })
  createPatient(@Body() createPatientDto: CreatePatientDto) {
    return this.usersService.createPatient(createPatientDto);
  }

  @Get('patients')
  @ApiOperation({ summary: 'Get all patients' })
  @ApiResponse({ status: 200, description: 'List of patients' })
  getAllPatients() {
    return this.usersService.findAllPatients();
  }

  @Post('doctors')
  @ApiOperation({ summary: 'Register a new doctor' })
  @ApiResponse({ status: 201, description: 'Doctor registered successfully' })
  createDoctor(@Body() createDoctorDto: CreateDoctorDto) {
    return this.usersService.createDoctor({
      ...createDoctorDto,
      passwordHash: createDoctorDto.password,
    });
  }

  @Get('doctors')
  @ApiOperation({ summary: 'Get all doctors' })
  @ApiResponse({ status: 200, description: 'List of doctors' })
  getAllDoctors() {
    return this.usersService.findAllDoctors();
  }
}
