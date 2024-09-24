import { Storage } from '@google-cloud/storage';
import { config } from '../../config';
import { InternalServerErrorException } from '../../shared/exceptions';
import { MultipartFile } from '@fastify/multipart';

// Future improvements:
// Implement an abstract file upload class to enable easy switching between providers and make this service agnostic.
// Enhance logging and traceability.
// mock google storage and add unit test

export class FileUploadService {
  private storage: Storage;
  private bucketName: string;

  constructor() {
    this.storage = new Storage({
      keyFilename: config.gcc.svc!,
    });
    this.bucketName = config.gcc.bucketName;
  }

  async uploadFile(file: MultipartFile, userUid: string): Promise<string> {
    try {
      const blob = this.storage.bucket(this.bucketName).file(`${userUid}-${file.filename}`);
      const stream = blob.createWriteStream({
        resumable: false,
        contentType: file.mimetype,
      });
  
      file.file.pipe(stream);
      
      await new Promise<void>((resolve, reject) => {
        stream.on('finish', resolve);
        stream.on('error', reject);
      });

      return `https://storage.googleapis.com/${this.bucketName}/${blob.name}`;
    } catch (error) {
      throw new InternalServerErrorException('File upload failed');
    }
  }
}