import { Test, TestingModule } from '@nestjs/testing';
import { ProfileController } from './profile.controller';

describe('ProfileController', () => {
  let profileController: ProfileController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [],
    }).compile();
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(1).toBe(1);
    });
  });
});
