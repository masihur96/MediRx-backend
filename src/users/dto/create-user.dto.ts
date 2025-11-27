import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsEmail, IsOptional, MinLength, ValidateIf } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'User name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'password123', description: 'User password', minLength: 6 })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: UserRole.PATIENT,
    description: 'User role',
    enum: UserRole
  })
  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;

  // Email - required for admin, optional for others
  @ApiProperty({
    example: 'admin@example.com',
    description: 'Email (required for admin)',
    required: false
  })
  @ValidateIf(o => o.role === UserRole.ADMIN)
  @IsEmail()
  @IsNotEmpty({ message: 'Email is required for admin users' })
  @ValidateIf(o => o.role !== UserRole.ADMIN)
  @IsOptional()
  @IsEmail()
  email?: string;

  // Phone - required for patient and doctor
  @ApiProperty({
    example: '+8801712345678',
    description: 'Phone number (required for patient and doctor)',
    required: false
  })
  @ValidateIf(o => o.role === UserRole.PATIENT || o.role === UserRole.DOCTOR)
  @IsString()
  @IsNotEmpty({ message: 'Phone is required for patient and doctor users' })
  @ValidateIf(o => o.role === UserRole.ADMIN)
  @IsOptional()
  @IsString()
  phone?: string;

  // BMDC Code - required only for doctors
  @ApiProperty({
    example: 'A-12345',
    description: 'BMDC registration code (required for doctor)',
    required: false
  })
  @ValidateIf(o => o.role === UserRole.DOCTOR)
  @IsString()
  @IsNotEmpty({ message: 'BMDC code is required for doctor users' })
  @ValidateIf(o => o.role !== UserRole.DOCTOR)
  @IsOptional()
  @IsString()
  bmdcCode?: string;
}
