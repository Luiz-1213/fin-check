import { Injectable } from '@nestjs/common';
import { type Prisma } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class RefreshTokensRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createDto: Prisma.RefreshTokenCreateArgs) {
    return this.prismaService.refreshToken.create(createDto);
  }

  findById(deleteDto: Prisma.RefreshTokenFindUniqueArgs) {
    return this.prismaService.refreshToken.findUnique(deleteDto);
  }

  delete(deleteDto: Prisma.RefreshTokenDeleteArgs) {
    return this.prismaService.refreshToken.delete(deleteDto);
  }
}
