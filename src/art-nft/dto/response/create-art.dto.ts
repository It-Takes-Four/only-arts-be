export class CreateArtResponse {
  constructor(
    public artistId: string,
    public artId: string,
    public tokenId: bigint
  ) {}
}