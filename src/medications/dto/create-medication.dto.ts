export class CreateMedicationDto {
  name_en: string;
  name_bn?: string;
  dosage?: string;
  form?: string;
  instructions?: string;
  userId: number; // reference to User id
}
