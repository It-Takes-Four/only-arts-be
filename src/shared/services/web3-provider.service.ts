import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

@Injectable()
export class Web3ProviderService implements OnModuleInit {
    private readonly logger = new Logger(Web3ProviderService.name);
    private provider: ethers.JsonRpcProvider;
    private wallet: ethers.Wallet;

    constructor(private configService: ConfigService) { }

    async onModuleInit() {
        await this.initializeProvider();
    }

    private async initializeProvider() {
        try {
            const rpcUrl = this.configService.get<string>('web3.rpcUrl');
            const privateKey = this.configService.get<string>('web3.privateKey');

            if (!rpcUrl || !privateKey) {
                throw new Error('Missing required Web3 configuration');
            }

            this.provider = new ethers.JsonRpcProvider(rpcUrl);
            this.wallet = new ethers.Wallet(privateKey, this.provider);

            if (!this.provider) {
                throw new Error('Failed to create Web3 provider');
            }

            if (!this.wallet.provider) {
                throw new Error('Failed to create wallet with provider');
            }

            const network = await this.provider.getNetwork();
            const balance = await this.wallet.provider.getBalance(this.wallet.address);

            this.logger.log(`Connected to network: ${network.name} (${network.chainId})`);
            this.logger.log(`Wallet address: ${this.wallet.address}`);
            this.logger.log(`Wallet balance: ${ethers.formatEther(balance)} ETH`);

        } catch (error) {
            this.logger.error('Failed to initialize Web3 provider', error);
            throw error;
        }
    }

    getProvider(): ethers.JsonRpcProvider {
        if (!this.provider) {
            throw new Error('Web3 provider not initialized');
        }
        return this.provider;
    }

    getWallet(): ethers.Wallet {
        if (!this.wallet) {
            throw new Error('Wallet not initialized');
        }
        return this.wallet;
    }
}