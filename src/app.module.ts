import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MedicationsModule } from './medications/medications.module';
import { SchedulingModule } from './scheduling/scheduling.module';
import { RemindersModule } from './reminders/reminders.module';
import { ReportsModule } from './reports/reports.module';
import { AiModule } from './ai/ai.module';
import { SettingsModule } from './settings/settings.module';
// import { i18nConfig } from './i18n.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
  TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'password', // ✅ must be a string
  database: process.env.DB_NAME || 'medirx',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true, // dev only
}),
    // i18n module (see later)
    UsersModule,
    AuthModule,
    MedicationsModule,
    SchedulingModule,
    RemindersModule,
    ReportsModule,
    AiModule,
    SettingsModule,
  ],
})
export class AppModule {}
