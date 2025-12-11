// src/users/users.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
// import { CreatePatientDto } from './dto/create-patient.dto';
// import { CreateDoctorDto } from './dto/create-doctor.dto';
// import { CreateAdminDto } from './dto/create-admin.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
  ) { }

  /**
   * Create a user with role-based field validation
   */
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    // Validate role-specific required fields
    this.validateRoleRequiredFields(createUserDto);

    // Check for existing user with same credentials
    await this.checkDuplicateCredentials(createUserDto);

    // Hash password
    const passwordHash = await bcrypt.hash(createUserDto.password, 10);

    // Create user
    const user = this.userRepo.create({
      name: createUserDto.name,
      passwordHash,
      role: createUserDto.role,
      email: createUserDto.email,
      phone: createUserDto.phone,
      bmdcCode: createUserDto.bmdcCode,
    });

    return this.userRepo.save(user);
  }


  /**
   * Validate that required fields are present based on role
   */
  private validateRoleRequiredFields(data: CreateUserDto): void {
    switch (data.role) {
      case UserRole.PATIENT:
        if (!data.phone) {
          throw new BadRequestException('Phone is required for patient users');
        }
        break;
      case UserRole.DOCTOR:
        if (!data.phone) {
          throw new BadRequestException('Phone is required for doctor users');
        }
        if (!data.bmdcCode) {
          throw new BadRequestException('BMDC code is required for doctor users');
        }
        break;
      case UserRole.ADMIN:
        if (!data.email) {
          throw new BadRequestException('Email is required for admin users');
        }
        break;
    }
  }

  /**
   * Check for duplicate credentials based on role
   */
  private async checkDuplicateCredentials(data: CreateUserDto): Promise<void> {
    if (data.email) {
      const existingEmail = await this.userRepo.findOne({ where: { email: data.email } });
      if (existingEmail) {
        throw new BadRequestException('Email already exists');
      }
    }

    if (data.phone) {
      const existingPhone = await this.userRepo.findOne({ where: { phone: data.phone } });
      if (existingPhone) {
        throw new BadRequestException('Phone number already exists');
      }
    }

    if (data.bmdcCode) {
      const existingBmdc = await this.userRepo.findOne({ where: { bmdcCode: data.bmdcCode } });
      if (existingBmdc) {
        throw new BadRequestException('BMDC code already exists');
      }
    }
  }

  // Finder methods
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email } });
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { phone } });
  }

  async findByBmdcCode(bmdcCode: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { bmdcCode } });
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { id } });
  }

  async findAllUsers(): Promise<User[]> {
    return this.userRepo.find();
  }

  async findAllPatients(): Promise<User[]> {
    return this.userRepo.find({ where: { role: UserRole.PATIENT } });
  }

  async findAllDoctors(): Promise<User[]> {
    return this.userRepo.find({ where: { role: UserRole.DOCTOR } });
  }

  async findAllAdmins(): Promise<User[]> {
    return this.userRepo.find({ where: { role: UserRole.ADMIN } });
  }

  async updateRefreshToken(userId: string, refreshToken: string): Promise<void> {
    console.log(`Updating refresh token for user ${userId}`);
    try {
      const salt = await bcrypt.genSalt();
      const refreshTokenHash = await bcrypt.hash(refreshToken, salt);

      // using save instead of update to ensure it works
      const user = await this.findById(userId);
      if (user) {
        user.refreshTokenHash = refreshTokenHash;
        await this.userRepo.save(user);
        console.log(`Refresh token updated for user ${userId}`);
      } else {
        console.error(`User ${userId} not found during refresh token update`);
      }
    } catch (error) {
      console.error(`Error updating refresh token for user ${userId}:`, error);
    }
  }

  async getUserByAccessToken(token: string): Promise<User | null> {

  console.log('Incoming token:', token);
    try {
      // Extract token from "Bearer <token>"
      const extractedToken = token.replace('Bearer ', '');
      const payload = this.jwtService.verify(extractedToken);
      return this.findById(payload.sub);
    } catch (error) {
      throw new BadRequestException('Invalid access token');
    }
  }
}
