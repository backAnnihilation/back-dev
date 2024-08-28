import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { CaptureAdapter } from '../../../../../core/adapters/capture.adapter';

@Injectable()
export class CaptureGuard implements CanActivate {
  constructor(private captureAdapter: CaptureAdapter) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { captureToken } = request.body;
    
    if (captureToken) {
      const validCapture =
        await this.captureAdapter.validateCaptureToken(captureToken);

      if (!validCapture) return false;
    }

    return true;
  }
}
