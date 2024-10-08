import { HttpStatus } from "@nestjs/common";

export interface SuperTestBody<T = unknown> {
  body: T & {
    errors: string[];
  };
  status: string | HttpStatus
}
