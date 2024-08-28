import { validateOrReject, ValidationError } from 'class-validator';

export class LayerNoticeInterceptor<D = null> {
  public data: D | null = null;
  public extensions: LayerInterceptorExtension[];
  public code: number = 0;

  constructor(
    data: D | null = null,
    public errorMessage?: string,
  ) {
    this.data = data;
    this.extensions = [];
  }

  async validateFields(model: any) {
    try {
      await validateOrReject(model);
    } catch (errors) {
      (errors as ValidationError[]).forEach((e) => {
        const constraints = Object.values(e.constraints || {});
        for (const constraint of constraints) {
          this.addError(constraint, e.property, GetErrors.IncorrectModel);
        }
      });
    }
  }

  public addData(data: D): void {
    this.data = data;
  }
  public addError(
    message: string,
    key: string | null = null,
    code: number | null = null,
  ): void {
    this.code = code ?? 1;
    this.extensions.push(new LayerInterceptorExtension(message, key));
  }
  get hasError(): boolean {
    return this.code !== 0;
  }
}

export class LayerInterceptorExtension {
  public readonly message: string;
  public readonly key: string | null;
  constructor(message: string, key: string | null = null) {
    this.message = message;
    this.key = key;
  }
}

export enum GetErrors {
  DatabaseFail = 500,
  Transaction = 500,
  NotCreated = 500,
  NotFound = 404,
  Forbidden = 403,
  IncorrectModel = 400,
  IncorrectPassword = 401,
  DeniedAccess = 401,
}
