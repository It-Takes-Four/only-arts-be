import {
    IsUUID,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class IsFollowingDtoRequest {
    @ApiProperty({ description: 'UUID of the artist', example: '867968ab-0d80-4d36-bef0-6ce7264fa53a' })
    @IsUUID()
    artistId: string;
}
