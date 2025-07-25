import { IsUUID, IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateNotificationDto {
  @ApiProperty({ description: 'ID of the user receiving the notification' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({ description: 'Optional artist ID associated with the notification' })
  @IsOptional()
  @IsUUID()
  artistId?: string;

  @ApiProperty({ description: 'Content of the notification' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
