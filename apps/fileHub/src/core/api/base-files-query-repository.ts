import { Model, Document } from 'mongoose';
import { PostImageMetaDocument } from '../../features/file/domain/entities/post-image-meta.schema';

export class BaseFilesQueryRepository<TDocument extends Document, ViewModel> {
  constructor(private readonly model: Model<TDocument>) {}

  async getById(id: string): Promise<ViewModel | null> {
    try {
      const result = await this.model.findById(id).lean();
      return (this.fileToViewModel(result) as ViewModel) || null;
    } catch (error) {
      console.error(
        `Database fails operate during the find ${this.model}`,
        error,
      );
      return null;
    }
  }

  async findAll(): Promise<ViewModel[]> {
    const documents = await this.model.find().lean();
    return documents as ViewModel[];
  }

  private fileToViewModel = (file: any) => ({
    id: file._id.toString(),
    url: file.fileUrl,
    profileId: file.profileId,
    createdAt: file.createdAt.toString(),
  });

  private postImageToViewModel = (image: PostImageMetaDocument) => ({
    id: image._id.toString(),
    url: image.url,
    postId: image.postId,
    createdAt: image.createdAt.toString(),
  });
}
