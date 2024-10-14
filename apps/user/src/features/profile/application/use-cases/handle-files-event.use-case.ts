import {
  BaseEvent,
  EventType,
  IMAGES_COMPLETED,
  IMAGES_PROCESSED,
} from '@app/shared';
import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CompleteProfileImagesCommand } from './completed-profile-image.use-case';

export class HandleFilesEventCommand {
  constructor(public dto: IFileDto) {}
}
interface IFileDto extends BaseEvent {}

@CommandHandler(HandleFilesEventCommand)
export class HandleFilesEventUseCase
  implements ICommandHandler<HandleFilesEventCommand>
{
  private location = this.constructor.name;
  private readonly commandMap: Record<string, new (dto: any) => any> = {
    [EventType.PROFILE_IMAGES]: CompleteProfileImagesCommand,
  };

  constructor(private commandBus: CommandBus) {}

  async execute(command: HandleFilesEventCommand): Promise<void> {
    await this.processCommand(command.dto);
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
