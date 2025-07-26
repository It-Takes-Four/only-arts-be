import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Web3ProviderService } from './services/web3-provider.service';
import web3Config from './config/web3.config';

@Global()
@Module({
    imports: [ConfigModule.forFeature(web3Config)],
    providers: [Web3ProviderService],
    exports: [Web3ProviderService],
})
export class SharedModule { }