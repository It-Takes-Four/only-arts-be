import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class PrepareCollectionPurchaseDtoRequest {
    @ApiProperty({ description: 'UUID of the collection', example: '867968ab-0d80-4d36-bef0-6ce7264fa53a' })
    @IsUUID()
    collectionId: string;

    @ApiProperty({ description: 'UUID of the buyer', example: 'aa66a227-aa90-46e7-a944-9469d3b18e8e' })
    @IsUUID()
    buyerId: string;

    @ApiProperty({
        description: 'wallet address of the artist who owns the collection',
        example: '0xD257B998A205acCE3947eac6C9d57b36024158d1',
    })
    @IsString()
    artistWalletAddress: string;
}
