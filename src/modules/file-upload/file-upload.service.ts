import { Storage } from '@google-cloud/storage';
import { env } from '../../config';
import { InternalServerErrorException } from '../../shared/exceptions';

export class FileUploadService {
    private storage: Storage;
    private bucketName: string;

    constructor() {
        this.storage = new Storage({
            keyFilename: env.gcc.svc!,
        });
        this.bucketName = env.gcc.bucketName;

    }

    async uploadFile(file: any, user: any): Promise<string> {
        const fileName = `${Date.now()}-${user.uuid}`;
        const fileUpload = this.storage.bucket(this.bucketName).file(fileName);

        try {
            await new Promise((resolve, reject) => {
                file.pipe(fileUpload.createWriteStream())
                    .on('finish', resolve)
                    .on('error', () => {
                        reject(new Error('File upload failed'));
                    });
            });

            return `https://storage.googleapis.com/${this.bucketName}/${fileName}`;
        } catch (error: any) {
            throw new InternalServerErrorException(error.message || 'File upload failed')
        }
    }
}