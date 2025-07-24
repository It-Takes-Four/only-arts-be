import { IsUUID, IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateNotificationDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsOptional()
  @IsUUID()
  artistId?: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
