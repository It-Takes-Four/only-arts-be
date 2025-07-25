import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class VerifyRequest {
    @IsString()
    @ApiProperty({
        description: 'Wallet address of the user',
        example: '0xD257B998A205acCE3947eac6C9d57b36024158d1',
    })
    address: string;
    @IsString()
    @ApiProperty({
        description: 'The original message that was signed by the user',
        example: 'OnlyArts verification message: 123456',
    })
    message: string;

    @IsString()
    @ApiProperty({
        description: 'Cryptographic signature of the message signed with the user’s wallet',
        example: '0x3c5d8...7a9b0f',
    })
    signature: string;

    @IsString()
    @ApiProperty({
        description: 'Unique nonce included in the message to prevent replay attacks',
        example: '123456',
    })
    nonce: string;
}
