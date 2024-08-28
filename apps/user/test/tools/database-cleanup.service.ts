import { PrismaClient } from '@prisma/client';

export class TestDatabaseService {
  constructor(private readonly prisma: PrismaClient) {}

  async cleanDatabase() {
    await this.prisma.userSession.deleteMany();
    await this.prisma.userAccount.deleteMany();
  }
}
