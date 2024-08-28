import { ApiHeader } from '@nestjs/swagger';

export const CaptchaHeader = () =>
  ApiHeader({
    name: 'captchaToken',
    description: 'Google reCAPTCHA token for validating the request',
    required: true,
  });
