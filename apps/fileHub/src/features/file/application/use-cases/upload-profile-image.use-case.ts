import {
  ImageCategory,
  LayerNoticeInterceptor,
  OutputIdAndUrl,
} from '@app/shared';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectModel } from '@nestjs/mongoose';
import { Bucket } from '../../api/models/enums/file-models.enum';
import { InputProfileImageDto } from '../../api/models/input-models/profile-image.model';
import {
  ProfileImageDocument,
  ProfileImageMeta,
  ProfileImageMetaDto,
  ProfileImageModel,
} from '../../domain/entities/user-profile-image-meta.schema';
import { FilesService } from '../services/file-metadata.service';
import { ProfilesRepository } from '../../infrastructure/profiles-image.repository';

export class UploadProfileImageCommand {
  constructor(public imageDto: InputProfileImageDto) {}
}

@CommandHandler(UploadProfileImageCommand)
export class UploadProfileImageUseCase
  implements ICommandHandler<UploadProfileImageCommand>
{
  constructor(
    private filesService: FilesService,
    private filesRepo: ProfilesRepository<ProfileImageDocument>,
    @InjectModel(ProfileImageMeta.name)
    private ProfileImageModel: ProfileImageModel,
  ) {}

  async execute(
    command: UploadProfileImageCommand,
  ): Promise<LayerNoticeInterceptor<OutputIdAndUrl>> {
    const { profileId, image } = command.imageDto;
    const { originalname, size } = image;

    const { url, id: storageId } = await this.filesService.uploadFileInStorage({
      image,
      bucket: Bucket.Inst,
      imageCategory: ImageCategory.PROFILE,
      profileId,
    });

    const createdProfileImageNotice = await this.ProfileImageModel.makeInstance<
      ProfileImageMetaDto,
      ProfileImageMeta
    >({
      storageId,
      category: ImageCategory.PROFILE,
      name: originalname,
      size,
      url,
      profileId,
    });

    if (createdProfileImageNotice.hasError)
      return createdProfileImageNotice as LayerNoticeInterceptor;

    const profileImageDto = createdProfileImageNotice.data;
    const savedProfileImageId = await this.filesRepo.save(profileImageDto);

    console.log({ savedProfileImageId });

    const result = { id: savedProfileImageId.id, url };
    return new LayerNoticeInterceptor(result);
  }
}
