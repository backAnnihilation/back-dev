import { CommandBus, EventsHandler, IEventHandler } from '@nestjs/cqrs';

import { CreateUserAccountEvent } from '../create-user-account-event';
import { CreateUserCommand } from '../../commands/create-user.command';

@EventsHandler(CreateUserAccountEvent)
export class CreateUserAccountEventHandler
  implements IEventHandler<CreateUserAccountEvent>
{
  constructor(private commandBus: CommandBus) {}
  async handle(event: CreateUserAccountEvent) {
    try {
      const command = new CreateUserCommand(event.userDto);
      await this.commandBus.execute(command);
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
