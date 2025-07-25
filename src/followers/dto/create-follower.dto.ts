import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateFollowerDto {
  @ApiProperty({
    description: 'UUID of the user who is following',
    example: '4e199e0e-482a-4dfc-9d39-4a3cb0597261',
  })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'UUID of the artist being followed',
    example: '73912e4e-24ae-4cd7-aef6-5e7ac5db2fa4',
  })
  @IsUUID()
  artistId: string;
}
