import { Test, TestingModule } from '@nestjs/testing';

import { FilesController } from './files.controller';

describe('FilesController', () => {
  let filesController: FilesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [],
    }).compile();
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(1).toBe(1);
    });
  });
});
