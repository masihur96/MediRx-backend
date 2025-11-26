import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginPatientDto {
    @ApiProperty({ example: '+1234567890', description: 'Patient phone number' })
    @IsString()
    @IsNotEmpty()
    phone: string;

    @ApiProperty({ example: 'password123', description: 'Patient password' })
    @IsString()
    @IsNotEmpty()
    password: string;
}
