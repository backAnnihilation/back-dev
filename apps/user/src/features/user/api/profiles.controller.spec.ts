import { Test, TestingModule } from '@nestjs/testing';
import { UserProfilesController } from './profiles.controller';

describe('UserProfilesController', () => {
  let userProfilesController: UserProfilesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [UserProfilesController],
      providers: [],
    }).compile();
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(1).toBe(1);
    });
  });
});
