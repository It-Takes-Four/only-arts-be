export class CreateArtDtoResponse {
  constructor(
    public artistId: string,
    public artId: string,
    public tokenId: bigint
  ) {}
}