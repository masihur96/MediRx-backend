import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Medication } from '../../medications/entities/medication.entity';

// Enum for user roles
export enum UserRole {
  PATIENT = 'patient',
  DOCTOR = 'doctor',
  ADMIN = 'admin'
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PATIENT
  })
  role: UserRole;

  // Email - required for admin, optional for others
  @Column({ unique: true, nullable: true })
  email: string;

  // Phone - required for patient and doctor
  @Column({ unique: true, nullable: true })
  phone: string;

  // BMDC Code - required only for doctors
  @Column({ unique: true, nullable: true })
  bmdcCode: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Medication, medication => medication.user)
  medications: Medication[];
}
