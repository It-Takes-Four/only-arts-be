import { IsUUID, IsString, IsOptional, IsNotEmpty, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationType } from '@prisma/client';

export class SendNotificationsToUserFollowerRequestDto {
  @ApiProperty({ description: 'ID of the user making the art/collection' })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Notification item ID' })
  @IsUUID()
  @IsNotEmpty()
  notificationItemId: string;

  @ApiProperty({ description: 'Content of the notification' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    description: 'Content type of the notification',
    enum: NotificationType,
  })
  @IsEnum(NotificationType)
  notificationType: NotificationType;
}
