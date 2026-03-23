import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { Readable } from 'stream'; // Nativo de Node.js

@Injectable()
export class CloudinaryService {
  async uploadFile(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      if (!file) {
        return reject(
          new BadRequestException('No se ha proporcionado ningún archivo'),
        );
      }

      const upload = cloudinary.uploader.upload_stream(
        {
          folder: 'alliance_profiles',
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) return reject(new Error(error.message));
          if (!result)
            return reject(new Error('Resultado de Cloudinary vacío'));
          resolve(result);
        },
      );

      // Convertimos el buffer a un stream de forma nativa
      const readableStream = new Readable();
      readableStream.push(file.buffer);
      readableStream.push(null); // Indica el fin del stream

      readableStream.pipe(upload);
    });
  }
}
