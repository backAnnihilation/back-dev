import { Test, TestingModule } from '@nestjs/testing';

import { SubsController } from './subs.controller';

describe('SubsController', () => {
  let subsController: SubsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SubsController],
      providers: [],
    }).compile();
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(1).toBe(1);
    });
  });
});
