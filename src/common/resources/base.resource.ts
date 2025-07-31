import { plainToClass, instanceToPlain, ClassConstructor } from 'class-transformer';
import { ObjectUtils } from '../utils/object.utils';

export abstract class BaseResource<T = any> {
  constructor(protected data: T) {}

  transform(options: { removeNulls?: boolean } = {}): any {
    const instance = plainToClass(this.constructor as ClassConstructor<this>, this.data, {
      excludeExtraneousValues: true,
    });
    
    let result = instanceToPlain(instance);
    
    if (options.removeNulls) {
      result = ObjectUtils.removeNullValues(result);
    }
    
    return result;
  }

  static make<T, R extends BaseResource<T>>(
    this: new (data: T) => R,
    data: T,
    options?: { removeNulls?: boolean }
  ): any {
    return new this(data).transform(options);
  }

  toArray(options?: { removeNulls?: boolean }): any {
    return this.transform(options);
  }
}