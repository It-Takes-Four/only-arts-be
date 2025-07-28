import {
    IsString,
    IsNotEmpty,
    IsUUID,
    IsNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PurchaseStatus } from '@prisma/client';

export class CreateNewPurchaseDtoRequest {
    @ApiProperty({ description: 'UUID of the buyer', example: 'ceb4dcc1-863d-4ed3-8223-0cfa8b28639a' })
    @IsUUID()
    userId: string;

    @ApiProperty({ description: 'UUID of the collection', example: '867968ab-0d80-4d36-bef0-6ce7264fa53a' })
    @IsUUID()
    collectionId: string;

    @ApiProperty({
        description: 'Price of the art collection in ETH',
        example: '0.00001',
    })
    @IsNumber()
    @IsNotEmpty()
    price: number;

    @ApiProperty({ description: 'Transaction hash', example: '0xb5b0afc239317a42d5171d526b2f98fb3d77152fd0f36889766ce57dcd6fae3f' })
    @IsString()
    txHash: string;
}
