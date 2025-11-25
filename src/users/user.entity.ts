import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Medication } from '../medications/entities/medication.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column()
  passwordHash: string;

  @Column({ default: 'user' })
  role: string;

  // 🔥 Add this
  @OneToMany(() => Medication, medication => medication.user)
  medications: Medication[];

}
