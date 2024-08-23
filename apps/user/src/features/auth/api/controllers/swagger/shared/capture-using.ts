import { ApiOperation } from '@nestjs/swagger';

export const CaptureUsing = () =>
  ApiOperation({
    summary: 'User sign-in with reCAPTCHA validation',
    description: 'Sign in user with reCAPTCHA validation to prevent bots.',
  });
