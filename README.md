# Adonis Class Validator

Adonis Class Validator provides a means to validate a request data using a class schema.

On successful validation, the data returned from validation is an instance of the class schema used to validate the request.

## 🎁 Features

- Convenient nesting of class rules.
- Easy declaration of custom messages.
- In-built caching of class schema.
- Validate with existing V5 validator.
- Support for all V5 validator features (`custom messages`, `creating custom rules`, `profiling`, `reporting` etc).

## 📦 Installing

Simply run the following commands on your shell

```bash
npm install @lu7766lu7766/adonis-class-validator
node ace invoke @lu7766lu7766/adonis-class-validator
```

## 📌 Example

> We're making use of all the schemas and rules baked into Adonis. 😃

```ts
// SignupPayload.ts
import { validate, schema, rules } from "@ioc:Adonis/ClassValidator";

class SignupPayload {
  @validate(schema.string({}, [rules.required(), rules.email()]), {
    required: "Field {{name}} is required.",
    email: "Invalid email address",
  })
  public email!: string;
}
```

```ts
// SignupController.ts
import { SignupPayload } from "App/Validators";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

class SignupController {
  public async index({ request }: HttpContextContract) {
    const payload = await request.classValidate(SignupPayload);
    console.log(payload instanceof SignupPayload); // true
  }
}
```

> For more examples, check [here](./test/cases/classes.ts)

## Standalone Validator

If you want to make use of the validator class schema to validate any form of data (outside the controller), you can easily rely on the standalone `ClassValidator.validate(...)` helper function.

> NOTE: If the validation fails, an instance of ValidationException is thrown.

```ts
import {
  ClassValidator,
  ValidationException,
} from "@ioc:Adonis/ClassValidator";

async function sendEmail() {
  try {
    const payload = await ClassValidator.validate(SignupPayload, {
      email: "hello@stallsone.com",
    });
  } catch (err) {
    // if validation error occurs, `err` is an instance of `ValidationException`
  }
}
```

## ⚓️ Going Deeper

There are currently 2 decorators supported for validation. They include:

- `@validate()` : To validate primitive schemas such as `string`, `boolean`, `number`, `date`, `enum/enumSet`, `file`, `array([string|boolean|number|date|enum|file])`.
- `@validate.nested()`: To nest class validator schemas through `array` and `object`.

### Nested Validation

To nest a class validator schema, simply rely on the `@validate.nested()` decorator. It requires:

- The `class validator schema` of the nested field.
- A `callback` that whose:
  - `parameter`: is a adonis member equivalent of the validator schema.
  - `return type`: is the adonis schema to use to validate the nested field (which is either an `array` or `object`).
- An `optional` custom message object.

> Custom messages also support interpolation e.g. `Field {{name}} is required`.

```ts
import { validate } from "@ioc:Adonis/ClassValidator";

class Address {
  @validate(schema.number([
    rules.unique({ table: "users", column: "email" })
  ]),
  { unique: 'Field must be unique.' })
  public id!: number;
}

class User {
  @validate.nested(
    Address,
    (address) => schema
      .array([rules.minLength(2)])
      .members(schema.object().members(address)),
    { minLength: "Field {{name}} must contain at least 2 addresses." }
  )
  public addresses!: Address[];
```

#### Custom Messages

When `request.classValidate(...)` is called against the `User` schema [above](#nested-validation), the custom message generated and used for the failed validation will be:

```json
{
  "addresses.minLength": "Field addresses must contain at least 2 addresses.",
  "addresses.*.unique": "Field must be unique."
}
```

> As far as the decorated field schema is a `schema.array()` with a `.members(...) of nested validation class`, it infers that it as the deep matching (`.*.`) patter matcher.

### Empty Classes

If no property in a class was decorated with `validate()`, an empty data will be returned (where each field will be undefined).

```ts
// Notice there's no schema rule.
class UserPayload {
  public firstname!: string;
}

// UserController.ts
export default class UsersController {
  public async index({ request }: HttpContextContract) {
    const data = await request.classValidate(UserPayload);

    /**
     * Payload wasn't validated because the class doesn't
     * have a property decorated with a schema.
     */
    console.log(data instanceof SignupPayload); // true

    /**
     * Data is empty because no property has a validator schema decorator.
     */
    console.log(payload); // {}
  }
}
```

## 📝 Contributing

If you find any issue, bug or missing feature, please kindly create an issue or submit a pull request.

## 🔖 License

Adonis Class Validator is open-sourced software under MIT license.
