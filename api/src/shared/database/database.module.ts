import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { BankAccountsRepository } from './repositories/bankAccounts.repositories';
import { CategoriesRepository } from './repositories/categories.repositories';
import { RefreshTokensRepository } from './repositories/refreshTokens.repository';
import { TransactionRepository } from './repositories/transactions.repositories';
import { UsersRepository } from './repositories/users.repositories';

@Global()
@Module({
  providers: [
    PrismaService,
    UsersRepository,
    CategoriesRepository,
    BankAccountsRepository,
    TransactionRepository,
    RefreshTokensRepository,
  ],
  exports: [
    UsersRepository,
    CategoriesRepository,
    BankAccountsRepository,
    TransactionRepository,
    RefreshTokensRepository,
  ],
})
export class DatabaseModule {}
