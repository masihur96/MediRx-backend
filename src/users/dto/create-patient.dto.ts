import { ApiProperty } from '@nestjs/swagger';

export class CreatePatientDto {
    @ApiProperty({ example: 'Jane Doe' })
    name: string;

    @ApiProperty({ example: 'password123' })
    password: string;

    @ApiProperty({ example: '1234567890' })
    phone: string;
}
