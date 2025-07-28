import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class NonceDtoRequest {
  @IsString()
  @ApiProperty({
    description: 'Wallet address of the user',
    example: '0xD257B998A205acCE3947eac6C9d57b36024158d1',
  })
  address: string;
}
