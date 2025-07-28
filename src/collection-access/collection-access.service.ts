import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { collectionAccessABI } from '../../smart_contracts/collectionAccessABI';
import { ethers } from 'ethers';
import { TokenInfo } from 'src/art-nft/interfaces/art-nft.interface';
import { Web3ProviderService } from 'src/shared/services/web3-provider.service';
import { ConfigService } from '@nestjs/config';

const tokenAbi = collectionAccessABI;

@Injectable()
export class CollectionAccessService implements OnModuleInit {
  private readonly logger = new Logger(CollectionAccessService.name);
  private contract: ethers.Contract;
  private contractAddress: string;
  private tokenInfo: TokenInfo;

  constructor(
    private web3Provider: Web3ProviderService,
    private configService: ConfigService,
  ) {}

  async onModuleInit() {
    await this.initializeContract();
  }

  private async initializeContract() {
    try {
      this.contractAddress = this.configService.get<string>(
        'web3.collectionAccessContractAddress',
      )!;

      if (!this.contractAddress) {
        throw new Error('Contract address not configured');
      }

      const wallet = this.web3Provider.getWallet();
      this.contract = new ethers.Contract(
        this.contractAddress,
        tokenAbi,
        wallet,
      );

      // Verify contract exists
      const code = await this.web3Provider
        .getProvider()
        .getCode(this.contractAddress);
      if (code === '0x') {
        throw new Error(`No contract found at address ${this.contractAddress}`);
      }

      // Cache token info
      this.tokenInfo = await this.fetchTokenInfo();
      this.logger.log(
        `Contract initialized: ${this.tokenInfo.name} (${this.tokenInfo.symbol})`,
      );
      this.logger.log(`Contract address: ${this.contractAddress}`);
    } catch (error) {
      this.logger.error('Failed to initialize contract', error);
      throw error;
    }
  }

  private async fetchTokenInfo(): Promise<TokenInfo> {
    const [name, symbol] = await Promise.all([
      this.contract.name(),
      this.contract.symbol(),
    ]);

    return {
      name,
      symbol,
      contractAddress: this.contractAddress,
    };
  }
}
