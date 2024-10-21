// import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
// ('../../api/models/input-models/fill-profile.model');
// import {
//   UserProfile,
//   UserProfileModel,
// } from '../../domain/entities/user-profile.schema';
// import { UpdateProfileDto } from '../../api/models/input-models/fill-profile.model';
// import { LayerNoticeInterceptor } from '../../../../../../../libs/shared/notification';
// import { OutputId } from '../../../../../../../libs/shared/models/output-id.dto';
// import { InjectModel } from '@nestjs/mongoose';

// export class UpdateProfileCommand {
//   constructor(public profileDto: UpdateProfileDto) {}
// }

// /**
//  * DEPRECATE
//  */
// @CommandHandler(UpdateProfileCommand)
// export class UpdateProfileUseCase
//   implements ICommandHandler<UpdateProfileCommand>
// {
//   private location = this.constructor.name;
//   constructor(
//     @InjectModel(UserProfile.name) private ProfileModel: UserProfileModel,
//     private profileRepo: ProfilesRepository,
//   ) {}

//   async execute(
//     command: UpdateProfileCommand,
//   ): Promise<LayerNoticeInterceptor<OutputId>> {
//     let notice = new LayerNoticeInterceptor<any>();

//     const createdProfileNotice = await this.ProfileModel.makeInstance(
//       command.profileDto,
//     );

//     if (createdProfileNotice.hasError)
//       return createdProfileNotice as LayerNoticeInterceptor;

//     const userDto = createdProfileNotice.data;

//     const result = await this.profileRepo.save(userDto);

//     notice.addData({ id: result.id });
//     return notice;
//   }
// }
