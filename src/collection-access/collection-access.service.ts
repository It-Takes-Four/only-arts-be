import { BadRequestException, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { collectionAccessABI } from '../../smart_contracts/collectionAccessABI';
import { ethers } from 'ethers';
import { TokenInfo } from 'src/art-nft/interfaces/art-nft.interface';
import { Web3ProviderService } from 'src/shared/services/web3-provider.service';
import { ConfigService } from '@nestjs/config';
import { PrepareCollectionPurchaseRequest } from './dto/request/prepare-collection-purchase.dto';

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

    async hasAccessToCollection(buyerId: string, collectionId: string): Promise<boolean>{
        const hasAccess = await this.contract.hasAccessToCollection(buyerId, collectionId)

        this.logger.log("Has Access:", hasAccess)

        return hasAccess
    }

    // Prepare transaction data for frontend
    async prepareCollectionPurchase(dto: PrepareCollectionPurchaseRequest) {
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

    // Verify transaction after frontend executes it
    async verifyAndRecordPurchase(txHash: string) {
        const receipt = await this.web3Provider.getProvider().getTransactionReceipt(txHash);
        
        if (receipt && receipt.status === 1) {
            // Parse events and update purchase entity status your database
            
            // Record the successful purchase
            
            
            return { success: true };
        }
        
        throw new BadRequestException('Transaction failed');
    }

    // async buyAccessToCollection(dto: BuyAccessToCollectionRequest): Promise<BuyAccessToCollectionResponse> {
    //     if (!this.contract) {
    //         throw new BadRequestException('Contract not initialized');
    //     }

    //     try {
    //         const priceInEth = ethers.parseEther(dto.price)

    //         const tx = await this.contract.buyAccessToCollection(dto.collectionId, dto.buyerId, priceInEth, dto.artistWalletAddress, { value: priceInEth });
    //         this.logger.log('Transaction sent:', tx.hash);

    //         const receipt = await tx.wait();
    //         this.logger.log('Transaction confirmed in block:', receipt.blockNumber);

    //         if (!receipt || receipt.status !== 1) {
    //             throw new BadRequestException('Transaction failed');
    //         }

    //         let buyerId: string = "";
    //         let collectionId: string = "";
    //         let tokenId: bigint | null = null;
    //         let price: string = "";

    //         for (const log of receipt.logs) {
    //             try {
    //                 const parsedLog = this.contract.interface.parseLog(log);
    //                 if (parsedLog && parsedLog.name === 'CollectionAccessPurchased') {
    //                     buyerId = parsedLog.args[0];
    //                     collectionId = parsedLog.args[1];
    //                     tokenId = parsedLog.args[2];
    //                     price = parsedLog.args[3];

    //                     this.logger.log(`Access to collection bought - BuyerId: ${buyerId}, CollectionId: ${collectionId}, Token ID: ${tokenId}, Price: ${price} ETH`);
    //                     break;
    //                 }
    //             } catch (parseError) {
    //                 this.logger.log("Failed to parse log")
    //                 continue;
    //             }
    //         }

    //         if (!tokenId) {
    //             throw new BadRequestException('Failed to retrieve token ID from collection access purchase');
    //         }

    //         return new BuyAccessToCollectionResponse(buyerId, collectionId, price);
    //     } catch (error) {
    //         this.logger.error('Error buying access to collection:', error);
    //         throw new BadRequestException(`Error buying access to collection: ${error.message}`);
    //     }
    // }
}
