import { ApiProperty } from '@nestjs/swagger';
import {
    IsUUID,
} from 'class-validator';

export class LikeArtDtoRequest {
    @ApiProperty({ description: 'UUID of the user', example: 'aa66a227-aa90-46e7-a944-9469d3b18e8e' })
    @IsUUID()
    userId: string;

    @ApiProperty({ description: 'UUID of the art', example: 'aa66a227-aa90-46e7-a944-9469d3b18e8e' })
    @IsUUID()
    artId: string;
}
