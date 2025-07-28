export class CompletePurchaseDtoResponse {
    constructor(
        public collectionId: string,
        public buyerId: string,
        public price: number,
        public txHash: string
    ) { }
}
