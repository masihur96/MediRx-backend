import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
// import { LoginPatientDto } from './dto/login-patient.dto';
// import { LoginDoctorDto } from './dto/login-doctor.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    @ApiOperation({
        summary: 'Unified login - accepts phone, email, or BMDC code',
        description: 'Auto-detects credential type and authenticates user. Supports:\n- Phone number (patient/doctor)\n- Email address (admin)\n- BMDC code (doctor)'
    })
    @ApiResponse({ status: 200, description: 'Return JWT access token and user info' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async login(@Body() loginDto: LoginDto) {
        const user = await this.authService.validateCredential(loginDto.credential, loginDto.password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return this.authService.login(user);
    }

    @Post('refresh')
    @ApiOperation({ summary: 'Refresh access token using a refresh token' })
    @ApiResponse({ status: 200, description: 'Return new access and refresh tokens' })
    @ApiResponse({ status: 401, description: 'Invalid refresh token' })
    async refreshAccessToken(@Body() refreshTokenDto: RefreshTokenDto) {
        return this.authService.refreshAccessToken(refreshTokenDto.refreshToken);
    }

    // @Post('login/patient')
    // @ApiOperation({ summary: 'Login a patient (legacy endpoint - use /auth/login instead)' })
    // @ApiResponse({ status: 200, description: 'Return JWT access token' })
    // @ApiResponse({ status: 401, description: 'Unauthorized' })
    // async loginPatient(@Body() loginDto: LoginPatientDto) {
    //     const patient = await this.authService.validatePatient(loginDto.phone, loginDto.password);
    //     if (!patient) {
    //         throw new UnauthorizedException('Invalid credentials');
    //     }
    //     return this.authService.loginPatient(patient);
    // }

    // @Post('login/doctor')
    // @ApiOperation({ summary: 'Login a doctor (legacy endpoint - use /auth/login instead)' })
    // @ApiResponse({ status: 200, description: 'Return JWT access token' })
    // @ApiResponse({ status: 401, description: 'Unauthorized' })
    // async loginDoctor(@Body() loginDto: LoginDoctorDto) {
    //     const doctor = await this.authService.validateDoctor(loginDto.bmdcCode, loginDto.password);
    //     if (!doctor) {
    //         throw new UnauthorizedException('Invalid credentials');
    //     }
    //     return this.authService.loginDoctor(doctor);
    // }
}
