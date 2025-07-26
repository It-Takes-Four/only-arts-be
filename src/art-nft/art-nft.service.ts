import {artNftABI} from '../../smart_contracts/artNftABI'
import { Injectable, Logger, OnModuleInit, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { Web3ProviderService } from '../shared/services/web3-provider.service';
import { TokenInfo } from './interfaces/art-nft.interface';
import { CreateArtResponse } from './dto/response/create-art.dto';


const tokenAbi = artNftABI;

@Injectable()
export class ArtNftService implements OnModuleInit {
  private readonly logger = new Logger(ArtNftService.name);
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
      this.contractAddress = this.configService.get<string>('web3.artNftContractAddress')!;
      
      if (!this.contractAddress) {
        throw new Error('Contract address not configured');
      }

      const wallet = this.web3Provider.getWallet();
      this.contract = new ethers.Contract(this.contractAddress, tokenAbi, wallet);

      // Verify contract exists
      const code = await this.web3Provider.getProvider().getCode(this.contractAddress);
      if (code === '0x') {
        throw new Error(`No contract found at address ${this.contractAddress}`);
      }

      // Cache token info
      this.tokenInfo = await this.fetchTokenInfo();
      this.logger.log(`Contract initialized: ${this.tokenInfo.name} (${this.tokenInfo.symbol})`);
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

  public async createArt(artistId: string, artId: string): Promise<CreateArtResponse> {
    if (!this.contract) {
      throw new BadRequestException('Contract not initialized');
    }

    try {
      const tx = await this.contract.createArt(artistId, artId);
      this.logger.log('Transaction sent:', tx.hash);
      
      const receipt = await tx.wait();
      this.logger.log('Transaction confirmed in block:', receipt.blockNumber);

      if (!receipt || receipt.status !== 1) {
        throw new BadRequestException('Transaction failed');
      }

      // Method 1: Parse logs manually (works for both ethers v5 and v6)
      let tokenId: bigint | null = null;
      
      for (const log of receipt.logs) {
        try {
          const parsedLog = this.contract.interface.parseLog(log);
          if (parsedLog && parsedLog.name === 'ArtCreated') {
            const artistAddress = parsedLog.args[0];
            tokenId = parsedLog.args[1];
            this.logger.log(`Art created - Artist: ${artistAddress}, Token ID: ${tokenId}`);
            break;
          }
        } catch (parseError) {
          this.logger.log("Failed to parse log")
          continue;
        }
      }

      if (!tokenId) {
        throw new BadRequestException('Failed to retrieve token ID from art creation');
      }

      return new CreateArtResponse(artistId, artId, tokenId);

    } catch (error) {
      this.logger.error('Error creating art:', error);
      throw new BadRequestException(`Failed to create art: ${error.message}`);
    }
  }

  // returns the art token id
  public async createCollection(address: string): Promise<string> {
    if (!this.contract) {
      throw new BadRequestException('Contract not initialized');
    }

    try {
      const tx = await this.contract.createCollection(address);
      this.logger.log('Transaction sent:', tx.hash);
      
      const receipt = await tx.wait();
      this.logger.log('Transaction confirmed in block:', receipt.blockNumber);

      if (!receipt || receipt.status !== 1) {
        throw new BadRequestException('Transaction failed');
      }

      // Method 1: Parse logs manually (works for both ethers v5 and v6)
      let tokenId: string | null = null;
      
      for (const log of receipt.logs) {
        try {
          const parsedLog = this.contract.interface.parseLog(log);
          if (parsedLog && parsedLog.name === 'CollectionCreated') {
            const artistAddress = parsedLog.args[0];
            tokenId = parsedLog.args[1].toString();
            this.logger.log(`Collection created - Artist: ${artistAddress}, Token ID: ${tokenId}`);
            break;
          }
        } catch (parseError) {
          this.logger.log("Failed to parse log")
          continue;
        }
      }

      if (!tokenId) {
        throw new BadRequestException('Failed to retrieve token ID from collection creation');
      }

      return tokenId;

    } catch (error) {
      this.logger.error('Error creating collection:', error);
      throw new BadRequestException(`Failed to create collection: ${error.message}`);
    }
  }
}