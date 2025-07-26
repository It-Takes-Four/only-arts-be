export class CreateCollectionResponse {
  constructor(
    public artistId: string,
    public collectionId: string,
    public tokenId: bigint
  ) {}
}