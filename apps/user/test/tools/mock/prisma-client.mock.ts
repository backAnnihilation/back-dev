export const mockPrismaService = {
  $connect: jest.fn(),
  $disconnect: jest.fn(),
};

export const MockedPrismaClient = jest.fn(() => mockPrismaService);
