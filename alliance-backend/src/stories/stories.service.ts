import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Story } from './schemas/story.schema';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service';

@Injectable()
export class StoriesService {
  constructor(
    @InjectModel(Story.name) private readonly storyModel: Model<Story>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(file: Express.Multer.File, userId: string): Promise<Story> {
    if (!file) {
      throw new BadRequestException('El archivo de la historia es obligatorio');
    }

    try {
      // 1. Subida a Cloudinary
      const result = await this.cloudinaryService.uploadFile(file);

      // 2. Creación del documento
      const newStory = new this.storyModel({
        author: new Types.ObjectId(userId),
        mediaUrl: result.secure_url,
        // Detectamos automáticamente si es video o imagen
        mediaType: result.resource_type === 'video' ? 'video' : 'image',
        viewedBy: [],
      });

      const savedStory = await newStory.save();

      // 3. Devolvemos poblado para el frontend
      return savedStory.populate({
        path: 'author',
        select: 'name profilePicture',
      });
    } catch (error) {
      console.error('Cloudinary Upload Error:', error);
      throw new InternalServerErrorException(
        'Error al procesar la historia en la nube',
      );
    }
  }

  async findAllActive(): Promise<Story[]> {
    // MongoDB limpia automáticamente los documentos expirados (TTL de 24h)
    return this.storyModel
      .find()
      .sort({ createdAt: -1 })
      .populate('author', 'name profilePicture')
      .exec();
  }

  async markAsViewed(storyId: string, userId: string) {
    // Usamos .exec() para que devuelva una Promesa real y tipada
    const story = await this.storyModel.findById(storyId).exec();

    if (!story) {
      throw new NotFoundException('La historia no existe o ya expiró (24h)');
    }

    // Comparamos IDs convirtiendo ambos a String (lo más seguro en JS)
    const userIdStr = userId.toString();
    const alreadyViewed = story.viewedBy.some(
      (id) => id.toString() === userIdStr,
    );

    if (!alreadyViewed) {
      // Agregamos el ID como ObjectId de Mongoose
      story.viewedBy.push(new Types.ObjectId(userId));
      await story.save();
    }

    return {
      message: 'Historia marcada como vista',
      viewsCount: story.viewedBy.length,
    };
  }
}
