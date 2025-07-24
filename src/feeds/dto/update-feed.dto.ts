import { IsString, IsOptional } from 'class-validator';

export class UpdateFeedDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;
}
