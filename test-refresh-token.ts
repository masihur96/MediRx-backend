
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './src/users/users.service';
import { User } from './src/users/entities/user.entity';
import { Medication } from './src/medications/entities/medication.entity';
import { ConfigModule } from '@nestjs/config';

async function run() {
    const module: TestingModule = await Test.createTestingModule({
        imports: [
            ConfigModule.forRoot(),
            TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DB_HOST || 'localhost',
                port: parseInt(process.env.DB_PORT || '5432'),
                username: process.env.DB_USER || 'postgres',
                password: process.env.DB_PASS || 'password',
                database: process.env.DB_NAME || 'medirx',
                entities: [User, Medication],
                synchronize: true,
            }),
            TypeOrmModule.forFeature([User]),
        ],
        providers: [UsersService],
    }).compile();

    const usersService = module.get<UsersService>(UsersService);

    // Create a user
    const user = await usersService.createUser({
        name: 'Script User',
        password: 'password',
        role: 'patient' as any,
        phone: '9999999999'
    });

    console.log('User created:', user.id);

    // Update refresh token
    await usersService.updateRefreshToken(user.id, 'some-refresh-token');

    // Fetch user again
    const updatedUser = await usersService.findById(user.id);
    if (updatedUser) {
        console.log('Updated user refreshTokenHash:', updatedUser.refreshTokenHash);

        if (updatedUser.refreshTokenHash) {
            console.log('SUCCESS: Refresh token hash updated');
        } else {
            console.log('FAILURE: Refresh token hash is null');
        }
    } else {
        console.log('FAILURE: User not found');
    }
}
run();
