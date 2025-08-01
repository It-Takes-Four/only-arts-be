import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches } from 'class-validator';

export class UpdateWalletAddressDto {
  @ApiProperty({
    description: 'Ethereum wallet address',
    example: '0x742d35Cc6C6C5f10C0d0a6b5b4e5c5e5a5d5c5e5',
    pattern: '^0x[a-fA-F0-9]{40}$',
  })
  @IsString()
  @Matches(/^0x[a-fA-F0-9]{40}$/, {
    message: 'Wallet address must be a valid Ethereum address (0x followed by 40 hexadecimal characters)',
  })
  walletAddress: string;
}
