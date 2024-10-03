import {
  EventType,
  LayerNoticeInterceptor,
  BaseEvent,
  IMAGES_COMPLETED,
} from '@app/shared';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ResponseProfileImageType } from '../../api/models/output/image-notice-type.model';
import { ProfilesRepository } from '../../infrastructure/profiles.repository';
import { CompleteProfileImagesCommand } from './completed-profile-image.use-case';

export class HandleFilesEventCommand {
  constructor(public fileDto: IFileDto) {}
}
interface IFileDto extends BaseEvent {}

@CommandHandler(HandleFilesEventCommand)
export class HandleFilesEventUseCase
  implements ICommandHandler<HandleFilesEventCommand>
{
  private location = this.constructor.name;
  private readonly commandMap: Record<string, new (dto: any) => any> = {
    [EventType.PROFILE_IMAGES]: CompleteProfileImagesCommand,
    [IMAGES_COMPLETED]: CompleteProfileImagesCommand,
  };

  constructor(private commandBus: CommandBus) {}

  async execute(command: HandleFilesEventCommand): Promise<void> {
    const { fileDto } = command;
    await this.processCommand(fileDto);
  }

  private async processCommand(dto: IFileDto) {
    const CommandClass = this.commandMap[dto.eventType];

    if (!CommandClass) {
      throw new Error(`Unknown event type: ${dto.eventType}`);
    }

    const commandInstance = new CommandClass(dto);
    await this.commandBus.execute(commandInstance);
  }
}
