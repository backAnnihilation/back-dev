import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { OutputId } from '@models/output-id.dto';
import { LayerNoticeInterceptor } from '@shared/notification';
import { FilesStorageAdapter } from '../../../../core/adapters/local-files-storage.adapter';
import { Bucket } from '../../api/models/enums/file-details.enum';
import { FileUploadType } from '../../api/models/input-models/extracted-file-types';
import { FilesService } from '../services/file-metadata.service';

export class UploadFileCommand {
  constructor(public uploadDto: FileUploadType) {}
}

@CommandHandler(UploadFileCommand)
export class UploadFileUseCase implements ICommandHandler<UploadFileCommand> {
  private location = this.constructor.name;
  constructor(
    private filesService: FilesService,
    private filesAdapter: FilesStorageAdapter,
  ) {}

  async execute(
    command: UploadFileCommand,
  ): Promise<LayerNoticeInterceptor<OutputId>> {
    const { profileId, ...fileCharacters } = command.uploadDto;
    const { fileFormat, buffer, fileType, mimetype, originalname, size } =
      fileCharacters;

    const { ContentType, Key } = this.filesService.generateImageKey({
      contentType: mimetype,
      fileName: originalname,
      imageType: fileType,
      profileId,
    });

    const bucketParams = {
      Bucket: Bucket.Inst,
      Key,
      Body: buffer,
      ContentType,
    };

    const uploadedFileInStorage =
    await this.filesAdapter.uploadFile(bucketParams);
    const { url: fileUrl, id: fileId } = uploadedFileInStorage;

    const savedFileNotice = await this.filesService.saveFileMeta({
      profileId,
      fileFormat,
      fileId,
      fileName: originalname,
      fileSize: size,
      fileType,
      fileUrl,
    });

    if (savedFileNotice.hasError)
      return savedFileNotice as LayerNoticeInterceptor;

    return new LayerNoticeInterceptor(savedFileNotice.data);
  }
}
