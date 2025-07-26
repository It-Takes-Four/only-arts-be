import { registerAs } from '@nestjs/config';

export default registerAs('web3', () => ({
    rpcUrl: process.env.RPC_URL,
    privateKey: process.env.PRIVATE_KEY,
    artNftContractAddress: process.env.ARTNFT_CONTRACT_ADDRESS,
    collectionAccessContractAddress: process.env.COLLECTION_ACCESS_CONTRACT_ADDRESS,
}));