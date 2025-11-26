import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) { }

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) return null;
    const match = await bcrypt.compare(pass, user.passwordHash);
    return match ? user : null;
  }

  async validatePatient(phone: string, pass: string) {
    const patient = await this.usersService.findPatientByPhone(phone);
    if (!patient) return null;
    const match = await bcrypt.compare(pass, patient.password);
    return match ? patient : null;
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }

  async loginPatient(patient: any) {
    const payload = { sub: patient.id, phone: patient.phone, role: 'patient' };
    return { access_token: this.jwtService.sign(payload) };
  }

  async validateDoctor(bmdcCode: string, pass: string) {
    const doctor = await this.usersService.findDoctorByBmdcCode(bmdcCode);
    if (!doctor) return null;
    const match = await bcrypt.compare(pass, doctor.passwordHash);
    return match ? doctor : null;
  }

  async loginDoctor(doctor: any) {
    const payload = { sub: doctor.id, bmdcCode: doctor.bmdcCode, role: 'doctor' };
    return { access_token: this.jwtService.sign(payload) };
  }

  async register(data: { email: string, password: string, name?: string, locale?: string }) {
    const hash = await bcrypt.hash(data.password, 10);
    return this.usersService.create({ ...data, passwordHash: hash });
  }
}
