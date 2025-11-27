import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreatePatientDto {
    @ApiProperty({ example: 'Jane Doe', description: 'Patient name' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'password123', description: 'Patient password', minLength: 6 })
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @ApiProperty({ example: '+8801712345678', description: 'Patient phone number' })
    @IsString()
    @IsNotEmpty()
    phone: string;
}
