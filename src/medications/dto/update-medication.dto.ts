import { PartialType } from '@nestjs/mapped-types';
import { CreateMedicationDto } from './create-medication.dto';

// PartialType makes all fields optional for updates
export class UpdateMedicationDto extends PartialType(CreateMedicationDto) {}