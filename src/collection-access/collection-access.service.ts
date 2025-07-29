import { BadRequestException, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { collectionAccessABI } from '../../smart_contracts/collectionAccessABI';
import { ethers } from 'ethers';
import { TokenInfo } from 'src/art-nft/interfaces/art-nft.interface';
import { Web3ProviderService } from 'src/shared/services/web3-provider.service';
import { ConfigService } from '@nestjs/config';
import { PrepareCollectionPurchaseDtoRequest } from './dto/request/prepare-collection-purchase.dto';

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
  ) { }

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

  async hasAccessToCollection(buyerId: string, collectionId: string): Promise<boolean> {
    const hasAccess = await this.contract.hasAccessToCollection(buyerId, collectionId)
    return hasAccess
  }

  // Prepare transaction data for frontend
  async prepareCollectionPurchase(dto: PrepareCollectionPurchaseDtoRequest) {
    return {
      contractAddress: this.contractAddress,
      functionName: 'buyAccessToCollection',
      parameters: {
        collectionId: dto.collectionId,
        buyerId: dto.buyerId,
        price: ethers.parseEther(dto.price).toString(),
        artistWalletAddress: dto.artistWalletAddress
      },
      value: ethers.parseEther(dto.price).toString(),
      abi: collectionAccessABI
    };
  }

  // Verify transaction after client executes it
  async verifyPurchase(txHash: string): Promise<boolean> {
    try {
      // Verify the transaction exists
      const tx = await this.web3Provider.getProvider().getTransaction(txHash);

      if (!tx) {
        throw new BadRequestException('Transaction not found');
      }

      // If transaction is not mined yet, wait for it
      if (!tx.blockNumber) {
        const receipt = await this.web3Provider.getProvider().waitForTransaction(txHash, 1);

        if (receipt && receipt.status === 1) {
          return true;
        }
      } else {
        // Transaction is mined, get receipt
        const receipt = await this.web3Provider.getProvider().getTransactionReceipt(txHash);

        if (receipt && receipt.status === 1) {
          return true;
        }
      }

      throw new BadRequestException('Transaction failed');

    } catch (error) {
      this.logger.error('Error verifying transaction:', error);
      throw new BadRequestException(`Transaction verification failed: ${error.message}`);
    }
  }
}
