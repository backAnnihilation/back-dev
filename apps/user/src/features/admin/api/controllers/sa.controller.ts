import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginationViewModel, RoutingEnum } from '@app/shared';
import { BasicSAAuthGuard } from '../../../auth/infrastructure/guards/basic-auth.guard';
import { CreateSACommand } from '../../application/commands/create-sa.command';
import { DeleteSACommand } from '../../application/commands/delete-sa.command';
import { SACudApiService } from '../../application/sa-cud-api.service';
import { CreateUserDto } from '../models/input-sa.dtos.ts/create-user.model';
import { SAQueryFilter } from '../models/outputSA.models.ts/sa-query-filter';
import { SAViewType } from '../models/user.view.models/userAdmin.view-type';
import { UsersQueryRepo } from '../query-repositories/user-account.query.repo';
import { CleanUpDatabaseRepository } from '../../infrastructure/clean-up.repo';
import { DropDatabaseSaEndpoint } from './swagger/drop-database-sa.description';
import { CreateSaUserEndpoint } from './swagger/create-user-sa.description';
import { GetAllUsersEndpoint } from './swagger/get-all-users-sa.description';
import { DeleteSaUserEndpoint } from './swagger/delete-user-sa.description';

@ApiTags(RoutingEnum.admins)
@UseGuards(BasicSAAuthGuard)
@Controller(RoutingEnum.admins)
export class SAController {
  constructor(
    private usersQueryRepo: UsersQueryRepo,
    private saCrudApiService: SACudApiService,
    private dbRepo: CleanUpDatabaseRepository,
  ) {}

  @GetAllUsersEndpoint()
  @Get()
  @HttpCode(HttpStatus.OK)
  async getUsers(
    @Query() query: SAQueryFilter,
  ): Promise<PaginationViewModel<SAViewType>> {
    return this.usersQueryRepo.getAllUsers(query);
  }

  @CreateSaUserEndpoint()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createSA(@Body() body: CreateUserDto): Promise<SAViewType> {
    const createCommand = new CreateSACommand(body);
    return this.saCrudApiService.create(createCommand);
  }

  @DeleteSaUserEndpoint()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSA(@Param('id') userId: string): Promise<void> {
    const command = new DeleteSACommand(userId);
    return this.saCrudApiService.updateOrDelete(command);
  }

  @DropDatabaseSaEndpoint()
  @Delete('testing/all-data')
  @HttpCode(HttpStatus.OK)
  async dropDataBase(): Promise<any> {
    return this.dbRepo.clearDatabase();
  }
}
