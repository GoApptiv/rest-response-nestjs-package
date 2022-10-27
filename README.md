# GoApptiv Standard Rest Response NestJS

This package provides classes to generate goapptiv standard rest response

## Installation

1. Create a `.npmrc` in the root folder and add the following lines.

```bash
//npm.pkg.github.com/:_authToken=TOKEN
@goapptiv:registry=https://npm.pkg.github.com/
```

2. Create a personal token with **read:packages** permission and replace the `TOKEN` with your personal token in the above mentioned file.

3. Install the package using the following command

```bash
npm install @goapptiv/rest-response-nestjs
```

4. Add the following snippet in the main.ts

```ts
import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { GaRestResponse } from '@goapptiv/rest-response-nestjs';

// transforms validation error to generalised format
app.useGlobalPipes(
  new ValidationPipe({
    exceptionFactory: (validationErrors: ValidationError[] = []) => {
      return new BadRequestException(
        GaRestResponse.transformValidationError(validationErrors),
      );
    },
  }),
);
```

## Usage

### Sending Success Response

```ts
import { GaRestResponse } from '@goapptiv/rest-response-nestjs';

RestResponse.success(customer);
```

### Sending Error Response

```ts
import { GaRestResponse } from '@goapptiv/rest-response-nestjs';

RestResponse.error(exception.message, errors);
```
