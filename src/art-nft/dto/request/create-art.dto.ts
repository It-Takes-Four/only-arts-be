import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateArtRequest {
  @ApiProperty({
    description: 'wallet address of the artist to whom the art NFT is assigned',
    example: '0xD257B998A205acCE3947eac6C9d57b36024158d1',
  })
  @IsString()
  address: string;
}
