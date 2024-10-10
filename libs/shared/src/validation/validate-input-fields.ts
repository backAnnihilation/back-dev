import { applyDecorators } from '@nestjs/common';
import { Transform, TransformFnParams } from 'class-transformer';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

/**
 * @param min field min length
 * @param max field max length
 * @param regexOption optional regex option for validation
 * @param message default "field doesn't match", optional message for validation match fails
 * @returns
 */
export const iSValidField = (
  { min, max },
  regexOption?: RegExp,
  message = "field doesn't match",
) => {
  const decorators = [
    Length(min, max, { message: `range of values [${min}, ${max}] ` }),
    IsNotEmpty(),
    Trim(),
    IsString(),
  ];

  if (regexOption) {
    decorators.unshift(Matches(regexOption, { message }));
  }

  return applyDecorators(...decorators);
};

export const Trim = () =>
  Transform(({ value }: TransformFnParams) => value?.trim());

export const IsValidPassword = ({ min, max }, match: RegExp) =>
  applyDecorators(
    Matches(match, { message: "field doesn't match" }),
    Length(min, max, { message: `range of values [${min}, ${max}] ` }),
    IsNotEmpty(),
    Trim(),
    IsString(),
  );
