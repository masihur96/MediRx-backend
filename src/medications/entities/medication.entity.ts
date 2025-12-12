import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Medication {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name_en: string;

  @Column({ nullable: true })
  name_bn: string;

  @Column({ nullable: true })
  dosage: string;

  @Column({ nullable: true })
  form: string;

  @Column('text', { nullable: true })
  instructions: string;

  //   @ManyToOne(() => User, user => user.medications)
  //   owner: User;

  @ManyToOne(() => User, (user) => user.medications)
  user: User; // rename from 'owner' to 'user'

  @CreateDateColumn()
  createdAt: Date;
}
