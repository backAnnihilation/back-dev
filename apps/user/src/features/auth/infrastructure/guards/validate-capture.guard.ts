import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { CaptureAdapter } from '@user/core/adapters';
import { Environment } from '@app/shared';

@Injectable()
export class CaptureGuard implements CanActivate {
  constructor(private captureAdapter: CaptureAdapter) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const captchaToken = request.headers['captchatoken'];
    if (process.env.ENV === Environment.DEVELOPMENT) return true;
    return this.captureAdapter.isValidCaptchaToken(captchaToken);
  }
}
