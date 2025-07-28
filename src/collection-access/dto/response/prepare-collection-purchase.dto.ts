export class PrepareCollectionPurchaseResponse {
  constructor(
    public buyerId: string,
    public collectionId: string,
    public price: string
  ) {}
}