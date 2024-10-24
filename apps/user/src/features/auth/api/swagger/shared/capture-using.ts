import { ApiHeader, ApiOperation } from '@nestjs/swagger';

export const CaptureUsing = () =>
  ApiOperation({
    summary: 'User sign-in with reCAPTCHA validation',
    description: 'Sign in user with reCAPTCHA validation to prevent bots.',
  });

export const CaptchaHeader = () =>
  ApiHeader({
    name: 'captchaToken',
    description: 'Google reCAPTCHA token for validating the request',
    required: true,
  });
