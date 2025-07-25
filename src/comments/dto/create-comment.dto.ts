import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: 'The content of the comment',
    example: 'This artwork is amazing!',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'UUID of the user posting the comment',
    example: 'd5bca877-9c30-4412-b89d-56782a48f34d',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'UUID of the artwork being commented on',
    example: 'a24e75f4-5081-4602-8e6e-b2aa36e79af0',
  })
  @IsUUID()
  @IsNotEmpty()
  artId: string;
}
