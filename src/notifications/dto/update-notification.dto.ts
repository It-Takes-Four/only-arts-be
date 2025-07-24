import { IsString, IsOptional, IsUUID } from 'class-validator';

export class UpdateNotificationDto {
  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsUUID()
  artistId?: string;

  @IsOptional()
  @IsString()
  content?: string;
}
