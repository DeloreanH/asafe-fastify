
import { asClass } from 'awilix';
import { FileUploadService } from './file-upload.service';

export const FileUploadModule = {
    fileUploadService: asClass(FileUploadService).singleton(),
}