import { NotificationType } from "@prisma/client";
import { Expose, Type } from "class-transformer";
import { IsEnum } from "class-validator";
import { BaseResource } from "src/common/resources/base.resource";

export class NotificationResource extends BaseResource {
    @Expose()
    id: string

    @Expose()
    message: string

    @Expose()
    notificationItemId?: string

    @Expose()
    @IsEnum(() => NotificationType)
    notificationType: NotificationType

    @Expose()
    @Type(() => Date)
    createdAt: Date

    static make(data: any, options?: { removeNulls?: boolean }): any {
    return super.make.call(this, data, options);
  }
}