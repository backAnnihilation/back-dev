import { UserSessionDto } from '../../../api/models/security-input.models/security-session-info.model';

export class DeleteOtherUserSessionsCommand {
  constructor(public userSessionInfo: UserSessionDto) {}
}
