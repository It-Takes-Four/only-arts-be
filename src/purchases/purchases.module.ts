import { Module } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [PurchasesService, PrismaService]
})
export class PurchasesModule {}
