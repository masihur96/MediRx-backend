// src/users/users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { Patient } from './entities/patient.entity';
import { Doctor } from './entities/doctor.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
    @InjectRepository(Patient)
    private readonly patientRepo: Repository<Patient>,
    @InjectRepository(Doctor)
    private readonly doctorRepo: Repository<Doctor>,
  ) { }

  async create(data: Partial<User>): Promise<User> {
    const user = this.repo.create(data);
    return this.repo.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({ where: { email } });
  }

  async createPatient(data: Partial<Patient>): Promise<Patient> {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    const patient = this.patientRepo.create(data);
    return this.patientRepo.save(patient);
  }

  async findPatientByPhone(phone: string): Promise<Patient | null> {
    return this.patientRepo.findOne({ where: { phone } });
  }

  async findAllPatients(): Promise<Patient[]> {
    return this.patientRepo.find();
  }

  async createDoctor(data: Partial<Doctor>): Promise<Doctor> {
    if (data.passwordHash) {
      data.passwordHash = await bcrypt.hash(data.passwordHash, 10);
    }
    const doctor = this.doctorRepo.create(data);
    return this.doctorRepo.save(doctor);
  }

  async findDoctorByBmdcCode(bmdcCode: string): Promise<Doctor | null> {
    return this.doctorRepo.findOne({ where: { bmdcCode } });
  }

  async findAllDoctors(): Promise<Doctor[]> {
    return this.doctorRepo.find();
  }
}
