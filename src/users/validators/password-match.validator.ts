import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  registerDecorator,
  ValidationOptions,
} from 'class-validator';

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

export function IsPasswordMatch(property: string, validationOptions?: ValidationOptions) {
  return function (target: object, propertyName: string): void {
    registerDecorator({
      target: (target as any).constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: IsPasswordMatchConstraint,
    });
  };
}
