import { Expose } from 'class-transformer';
import { DateToUnix } from '../transformers/date.transformer';

export function SoftDeleteMixin<T extends abstract new (...args: any[]) => any>(Base: T) {
  abstract class SoftDeleteClass extends Base {
    @Expose()
    @DateToUnix()
    deletedAt?: number | null;

    @Expose()
    deletedBy?: string | null;
  }

  return SoftDeleteClass;
}