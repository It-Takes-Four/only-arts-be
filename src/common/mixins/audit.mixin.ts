import { Expose } from 'class-transformer';
import { DateToUnix } from '../transformers/date.transformer';

export function AuditMixin<T extends abstract new (...args: any[]) => any>(Base: T) {
  abstract class AuditClass extends Base {
    @Expose()
    @DateToUnix()
    createdAt: number;

    @Expose()
    @DateToUnix()
    updatedAt: number;

    @Expose()
    @DateToUnix()
    deletedAt?: number | null;

    @Expose()
    deletedBy?: string | null;
  }

  return AuditClass;
}