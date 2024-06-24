import { ZodIssue } from "zod";

export type ErrorMessage<T> = {
  [key in keyof T]?: string;
};

export function parseValidationError<T extends Object>(
  inputObject: T,
  validationErrors: ZodIssue[]
): ErrorMessage<T> {
  const result: ErrorMessage<T> = {};

  validationErrors.forEach((error) => {
    const path = error.path[0];
    const message = error.message;

    if (path in inputObject) {
      result[path as keyof T] = message;
    }
  });

  return result;
}
