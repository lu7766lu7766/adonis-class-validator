declare module "@ioc:Adonis/ClassValidator" {
  import {
    ValidateDecorator,
    ClassValidator,
  } from "@ioc:Adonis/ClassValidator/Shared";

  import {
    rules,
    schema,
    validator,
    ValidationException,
  } from "@ioc:Adonis/Core/Validator";

  const validate: ValidateDecorator;
  const ClassValidator: ClassValidator;

  export {
    validate,
    schema,
    rules,
    validator,
    ValidationException,
    ClassValidator,
  };
}

declare module "@ioc:Adonis/Core/Validator" {
  interface Rules {
    withinField(options: {
      fieldName: string;
      unit: DurationUnits;
      duration: number;
    }): Rule;
  }
}
