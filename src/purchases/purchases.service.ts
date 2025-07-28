import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateNewPurchaseDtoRequest } from './dto/request/create-new-purchase.dto';
import { PurchaseStatus } from '@prisma/client';

@Injectable()
export class PurchasesService {
    constructor(private readonly prisma: PrismaService) { }

    async createNewPurchase(dto: CreateNewPurchaseDtoRequest) {
        return await this.prisma.purchase.create({
            data: {
                userId: dto.userId,
                collectionId: dto.collectionId,
                price: dto.price,
                txHash: dto.txHash,
                status: PurchaseStatus.PENDING,
            }
        })
    }

    async completePurchase(txHash: string) {
        return await this.prisma.purchase.update({
            where: { txHash: txHash },
            data: { status: PurchaseStatus.COMPLETED }
        })
    }

    async findOneByTxHash(txHash: string) {
        return await this.prisma.purchase.findFirst({
            where: { txHash: txHash }
        })
    }
}
