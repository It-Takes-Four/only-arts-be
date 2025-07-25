import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

// Define proper type for object with constructor
interface ObjectWithConstructor {
  constructor: new (...args: any[]) => any;
}

@ValidatorConstraint({ name: 'isPasswordMatch', async: false })
export class IsPasswordMatchConstraint implements ValidatorConstraintInterface {
  validate(confirmPassword: string, args: ValidationArguments): boolean {
    if (!args.constraints || args.constraints.length === 0) {
      return false;
    }
    
    const relatedPropertyName = args.constraints[0] as string;
    const obj = args.object as Record<string, unknown>;
    const relatedValue = obj[relatedPropertyName] as string;
    
    return confirmPassword === relatedValue;
  }

  defaultMessage(): string {
    return 'Passwords do not match';
  }
}

/**
 * Validates that the decorated property matches the value of the related property.
 * @param property The name of the related property to compare against
 * @param validationOptions Additional validation options
 */
export function IsPasswordMatch(
  property: string,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (target: ObjectWithConstructor, propertyName: string | symbol): void {
    registerDecorator({
      name: 'isPasswordMatch',
      target: target.constructor,
      propertyName: propertyName as string,
      options: validationOptions,
      constraints: [property],
      validator: IsPasswordMatchConstraint,
    });
  };
}
