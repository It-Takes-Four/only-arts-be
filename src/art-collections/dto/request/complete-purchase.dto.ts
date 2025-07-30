import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUUID } from 'class-validator';

export class CompletePurchaseDtoRequest {
    @ApiProperty({ description: 'UUID of the collection', example: '867968ab-0d80-4d36-bef0-6ce7264fa53a' })
    @IsUUID()
    collectionId: string;

    @ApiProperty({ description: 'UUID of the buyer', example: 'aa66a227-aa90-46e7-a944-9469d3b18e8e' })
    @IsUUID()
    buyerId: string;

    @ApiProperty({ description: 'transaction hash', example: '0xb5b0afc239317a42d5171d526b2f98fb3d77152fd0f36889766ce57dcd6fae3f' })
    @IsString()
    txHash: string;
}
