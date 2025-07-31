import { Transform } from 'class-transformer';

export function DateToUnix() {
  return Transform(({ value }) => {
    if (!value) return value;
    if (value instanceof Date) {
      return Math.floor(value.getTime() / 1000);
    }
    if (typeof value === 'string') {
      return Math.floor(new Date(value).getTime() / 1000);
    }
    return value;
  });
}
