import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './users.controller';
import { UsersService } from './users.service';

describe('UserController', () => {
  let controller: UserController;
  let usersService: UsersService;

  const mockUsersService = {
    getUserByAccessToken: jest.fn(),
    findAllUsers: jest.fn(),
    createUser: jest.fn(),
    findAllPatients: jest.fn(),
    findAllDoctors: jest.fn(),
    findAllAdmins: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getProfile', () => {
    it('should call getUserByAccessToken with the provided token', async () => {
      const token = 'Bearer test-token';
      const expectedUser = { id: 'user-id', name: 'Test User' };
      mockUsersService.getUserByAccessToken.mockResolvedValue(expectedUser);

      const req = { headers: { authorization: token } };
      const result = await controller.getProfile(token);

      expect(usersService.getUserByAccessToken).toHaveBeenCalledWith(token);
      expect(result).toEqual(expectedUser);
    });
  });
});
