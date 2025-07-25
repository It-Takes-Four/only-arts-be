import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateArtistDto {
  @ApiProperty({
    description: 'User ID (UUID) to associate with the artist profile',
    example: 'e3b0c442-98fc-1c14-9afb-4c1d4c6d2111',
  })
  @IsUUID()
  userId: string;
}
