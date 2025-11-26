import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginPatientDto } from './dto/login-patient.dto';
import { LoginDoctorDto } from './dto/login-doctor.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login/patient')
    @ApiOperation({ summary: 'Login a patient' })
    @ApiResponse({ status: 200, description: 'Return JWT access token' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async loginPatient(@Body() loginDto: LoginPatientDto) {
        const patient = await this.authService.validatePatient(loginDto.phone, loginDto.password);
        if (!patient) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return this.authService.loginPatient(patient);
    }

    @Post('login/doctor')
    @ApiOperation({ summary: 'Login a doctor' })
    @ApiResponse({ status: 200, description: 'Return JWT access token' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    async loginDoctor(@Body() loginDto: LoginDoctorDto) {
        const doctor = await this.authService.validateDoctor(loginDto.bmdcCode, loginDto.password);
        if (!doctor) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return this.authService.loginDoctor(doctor);
    }
}
