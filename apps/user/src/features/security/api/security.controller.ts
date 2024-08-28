import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { UserPayload } from '../../auth/infrastructure/decorators/user-payload.decorator';
import { RefreshTokenGuard } from '../../auth/infrastructure/guards/refreshToken.guard';
import { DeleteActiveSessionCommand } from '../application/use-cases/commands/delete-active-session.command';
import { DeleteOtherUserSessionsCommand } from '../application/use-cases/commands/delete-other-user-sessions.command';
import { UserSessionDto } from './models/security-input.models/security-session-info.model';
import { SecurityInterface } from './models/security-input.models/security.interface';
import { SecurityViewDeviceModel } from './models/security.view.models/security.view.types';
import { SecurityQueryRepo } from './query-repositories/security.query.repo';
import { ApiTags } from '@nestjs/swagger';
import { ApiTagsEnum, RoutingEnum } from '../../../../core/routes/routing';
import { GetUserActiveSessionsEndpoint } from './swagger/get-sessions.description';
import { TerminateOtherUserSessionsEndpoint } from './swagger/terminate-other-sessions.description';
import { DeleteSessionEndpoint } from './swagger/terminate-specific-session.description';

@ApiTags(ApiTagsEnum.Security)
@Controller(RoutingEnum.security)
@UseGuards(RefreshTokenGuard)
export class SecurityController implements SecurityInterface {
  constructor(
    private securityQueryRepo: SecurityQueryRepo,
    private commandBus: CommandBus,
  ) {}

  @GetUserActiveSessionsEndpoint()
  @Get()
  async getUserActiveSessions(
    @UserPayload() userInfo: UserSessionDto,
  ): Promise<SecurityViewDeviceModel[]> {
    const { userId } = userInfo;

    const securityData =
      await this.securityQueryRepo.getUserActiveSessions(userId);

    if (!securityData) {
      throw new UnauthorizedException();
    }

    return securityData;
  }

  @TerminateOtherUserSessionsEndpoint()
  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async terminateOtherUserSessions(@UserPayload() userInfo: UserSessionDto) {
    const command = new DeleteOtherUserSessionsCommand(userInfo);
    await this.commandBus.execute(command);
  }

  @DeleteSessionEndpoint()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSession(
    @Param('id') deviceId: string,
    @UserPayload() userInfo: UserSessionDto,
  ) {
    const sessionExistence =
      await this.securityQueryRepo.getUserSession(deviceId);

    if (!sessionExistence) {
      throw new NotFoundException('Session not found');
    }

    const sessions = await this.securityQueryRepo.getUserActiveSessions(
      userInfo.userId,
    );

    if (!sessions!.some((s) => s.deviceId === deviceId)) {
      throw new ForbiddenException('do not have permission');
    }

    const command = new DeleteActiveSessionCommand(userInfo);

    await this.commandBus.execute(command);
  }
}
