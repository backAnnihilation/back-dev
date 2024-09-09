import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from '../config/configuration';

@Injectable()
export class CaptureAdapter {
  private secretKey: string;
  private apiUrl: string;
  private readonly threshold = 0.5;
  constructor(private configService: ConfigService<EnvironmentVariables>) {
    this.secretKey = this.configService.get('GOOGLE_CAPTURE_SECRET');
    this.apiUrl = 'https://www.google.com/recaptcha/api/siteverify';
  }
  async validateCaptureToken(captureToken: string) {
    try {
      return await fetch(this.apiUrl, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
        body: `secret=${this.secretKey}&response=${captureToken}`,
      })
        .then((res) => res.json())
        .then((result) => this.isCaptchaValid(result));
    } catch (error) {
      console.error('Failed to verify captcha', error);
      return false;
    }
  }
  private isCaptchaValid = (response: RecaptchaResponse) =>
    response.success && response.score >= this.threshold;
}

type RecaptchaResponse = {
  success: boolean;
  challenge_ts: string;
  hostname: string;
  score: number;
  action: string;
  'error-codes': string[];
};
