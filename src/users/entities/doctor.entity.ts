import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Medication } from '../../medications/entities/medication.entity';

@Entity()
export class Doctor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  bmdcCode: string;

  @Column({ unique: true })
  phone: string;

  @Column()
  passwordHash: string;


  @OneToMany(() => Medication, medication => medication.user)
  medications: Medication[];
}
