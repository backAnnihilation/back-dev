import { LayerNoticeInterceptor } from '@app/shared';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';


export class HandleRedeliveredProfileImagesCommand {
  constructor(public profileId: string) {}
}

// @CommandHandler(ProfileImagesCheckCompletedCommand)
// export class CompletedProfileImageUseCase
//   implements ICommandHandler<ProfileImagesCheckCompletedCommand>
// {
//   private location = this.constructor.name;
//   constructor(private profilesRepo: ProfilesRepository) {}

//   async execute(
//     command: ProfileImagesCheckCompletedCommand,
//   ): Promise<LayerNoticeInterceptor<ResponseProfileImageType>> {
//     const notice = new LayerNoticeInterceptor<ResponseProfileImageType>();
//     const { profileId } = command;

//     const profileImage = await this.profilesRepo.getProfileImage(profileId);

//     if (profileImage.status === ImageStatus.pending) {
//       await this.profilesRepo.deleteProfileImage(profileImage.id);
//     }

//     notice.addData({ status: ImageStatus.pending, profileId });
//     return notice;
//   }
// }
