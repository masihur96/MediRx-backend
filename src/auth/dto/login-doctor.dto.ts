import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDoctorDto {
    @ApiProperty({ example: 'A-12345', description: 'BMDC registration code' })
    @IsString()
    @IsNotEmpty()
    bmdcCode: string;

    @ApiProperty({ example: 'password123', description: 'Doctor password' })
    @IsString()
    @IsNotEmpty()
    password: string;
}
