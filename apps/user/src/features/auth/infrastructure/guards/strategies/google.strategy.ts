import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';
import { EnvironmentVariables } from '../../../../../../core/config/configuration';
import { StrategyType } from '../../../../../../core/infrastructure/guards/models/strategy.enum';
import { sanitizedDisplayName } from '../../utils/sanitized-display-name';

@Injectable()
export class GoogleStrategy extends PassportStrategy(
  Strategy,
  StrategyType.Google,
) {
  constructor(configService: ConfigService<EnvironmentVariables>) {
    super({
      clientID: configService.get('OAUTH_GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('OAUTH_GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get('OAUTH_GOOGLE_REDIRECT_URL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const { id: providerId, emails, displayName, photos, provider } = profile;

    const email = emails?.[0]?.value;
    const photo = photos?.[0]?.value;

    if (!email || !photo) {
      return done(new Error('No provider info'), null);
    }
    const userName = sanitizedDisplayName(displayName);
    const usersProvider = {
      email,
      userName,
      avatar: photo,
      providerId,
      provider,
    };

    done(null, usersProvider);
  }
}
