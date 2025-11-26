import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateDoctorDto {
    @ApiProperty({ example: 'Dr. John Smith', description: 'Doctor name' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'doctor@example.com', description: 'Doctor email' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: 'A-12345', description: 'BMDC registration code' })
    @IsString()
    @IsNotEmpty()
    bmdcCode: string;

    @ApiProperty({ example: '+8801712345678', description: 'Doctor phone number' })
    @IsString()
    @IsNotEmpty()
    phone: string;

    @ApiProperty({ example: 'password123', description: 'Doctor password', minLength: 6 })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;
}
