import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Web3ProviderService } from './services/web3-provider.service';
import { StorageService } from './services/storage.service';
import { FileUploadService } from './services/file-upload.service';
import { UploadController } from './controllers/upload.controller';
import web3Config from './config/web3.config';

@Global()
@Module({
    imports: [ConfigModule.forFeature(web3Config)],
    providers: [Web3ProviderService, StorageService, FileUploadService],
    controllers: [UploadController],
    exports: [Web3ProviderService, StorageService, FileUploadService],
})
export class SharedModule { }