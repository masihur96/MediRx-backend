import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: '+8801712345678',
    description: 'Login credential (phone number, email, or BMDC code)',
    examples: {
      phone: {
        value: '+8801712345678',
        summary: 'Phone number for patient/doctor',
      },
      email: { value: 'admin@example.com', summary: 'Email for admin' },
      bmdc: { value: 'A-12345', summary: 'BMDC code for doctor' },
    },
  })
  @IsString()
  @IsNotEmpty()
  credential: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password',
    minLength: 6,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
