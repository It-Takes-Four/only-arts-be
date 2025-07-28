export class CreateCollectionDtoResponse {
  constructor(
    public artistId: string,
    public collectionId: string,
    public tokenId: bigint
  ) {}
}