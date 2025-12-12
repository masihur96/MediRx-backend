import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Medication } from './entities/medication.entity';
import { CreateMedicationDto } from './dto/create-medication.dto';
import { UpdateMedicationDto } from './dto/update-medication.dto';

@Injectable()
export class MedicationsService {
  constructor(
    @InjectRepository(Medication) private repo: Repository<Medication>,
  ) {}

  create(dto: CreateMedicationDto) {
    const med = this.repo.create(dto);
    return this.repo.save(med);
  }

  findAll(userId?: string) {
    return this.repo.find({ where: userId ? { user: { id: userId } } : {} });
  }

  async update(id: number, dto: UpdateMedicationDto) {
    const item = await this.repo.findOne({ where: { id } });
    if (!item) return { success: false, message: 'Medication not found' };

    Object.assign(item, dto);
    await this.repo.save(item);
    return { success: true, message: 'Medication updated successfully', id };
  }

  async remove(id: number) {
    const res = await this.repo.delete(id);
    if (res.affected === 0) return { success: false, message: 'Not found' };
    return { success: true, message: 'Medication deleted successfully', id };
  }
}
