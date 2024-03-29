import { ValidationError } from 'class-validator';
import { SystemErrors } from '../constants/errors.enum';
import { GaException } from '../interfaces/ga-exception.interface';
import {
  ResponseSuccess,
  ResponseError,
} from '../interfaces/response.interface';

export class RestResponse {
  /**
   * Build success response
   */
  static success(data: Record<string, any> | string): ResponseSuccess {
    return {
      success: true,
      data,
      timestamp: Date.now(),
    };
  }

  /**
   * Build response error
   */
  static error(
    message: string,
    errors: Record<string, any> | string,
  ): ResponseError {
    return {
      success: false,
      message,
      errors,
      timestamp: Date.now(),
    };
  }

  /**
   * Transforms class validator error to key value pair
   */
  static transformValidationError(
    validationErrors: Array<ValidationError>,
  ): Record<string, any> {
    const errors = [];

    validationErrors
      .map((error) => this.mapChildrenToValidationErrors(error))
      .flat()
      .filter((item) => !!item.constraints)
      .forEach((item) => {
        const message = Object.values(item.constraints)[0]
          ? Object.values(item.constraints)[0]
          : `${item.property} is invalid`;

        const exception: GaException = {
          type: SystemErrors.E400_VALIDATION_ERROR,
          message: message,
          context: {
            [item.property]: message,
          },
        };

        errors.push(exception);
      });

    return errors;
  }

  /**
   * Maps validation error children to validation errors
   */
  private static mapChildrenToValidationErrors(
    error: ValidationError,
  ): ValidationError[] {
    if (!(error.children && error.children.length)) {
      return [error];
    }
    const validationErrors = [];
    for (const item of error.children) {
      if (item.children && item.children.length) {
        validationErrors.push(...this.mapChildrenToValidationErrors(item));
      }
      validationErrors.push(this.prependConstraintsWithParentProp(error, item));
    }
    return validationErrors;
  }

  /**
   * Prepend validator error constraints with the Parent
   */
  private static prependConstraintsWithParentProp(
    parentError: ValidationError,
    error: ValidationError,
  ): ValidationError {
    const constraints = {};
    for (const key in error.constraints) {
      constraints[key] = `${parentError.property}.${error.constraints[key]}`;
    }

    return {
      ...error,
      property: parentError.property,
      constraints,
    };
  }
}
