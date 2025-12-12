import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MedicationsModule } from './medications/medications.module';
import { SchedulingModule } from './scheduling/scheduling.module';
import { RemindersModule } from './reminders/reminders.module';
import { ReportsModule } from './reports/reports.module';
import { AiModule } from './ai/ai.module';
import { SettingsModule } from './settings/settings.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
// import { i18nConfig } from './i18n.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // 👈 Force NestJS to load .env
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 5432),
        username: configService.get<string>('DB_USER', 'postgres'),
        password: configService.get<string>('DB_PASS', 'password'),
        database: configService.get<string>('DB_NAME', 'medirx'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
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

  // 👇 ADD THESE
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
