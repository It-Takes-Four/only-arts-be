import {
    IsString,
    IsUrl,
    IsNotEmpty,
    IsOptional,
    IsArray,
    IsUUID,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNewPurchaseRequest {
    @ApiProperty({ description: 'UUID of the buyer', example: 'ceb4dcc1-863d-4ed3-8223-0cfa8b28639a' })
    @IsUUID()
    userId: string;

    @ApiProperty({ description: 'UUID of the collection', example: '867968ab-0d80-4d36-bef0-6ce7264fa53a' })
    @IsUUID()
    collectionId: string;

    
    price: string;

    @ApiPropertyOptional({ description: 'Optional list of tag UUIDs', example: ['4e365859-e8d4-4cf7-8091-9acbb7c1dc56'] })
    @IsOptional()
    @IsArray()
    @IsUUID('all', { each: true })
    tagIds?: string[];
}
