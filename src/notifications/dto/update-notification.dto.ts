import { IsString, IsOptional, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateNotificationDto {
  @ApiPropertyOptional({ description: 'User ID receiving the notification', type: String, format: 'uuid' })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiPropertyOptional({ description: 'Associated artist ID', type: String, format: 'uuid' })
  @IsOptional()
  @IsUUID()
  artistId?: string;

  @ApiPropertyOptional({ description: 'Content of the notification', type: String })
  @IsOptional()
  @IsString()
  content?: string;
}
