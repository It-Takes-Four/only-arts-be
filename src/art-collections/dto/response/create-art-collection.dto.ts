export class CreateArtCollectionDtoResponse {
    constructor(
        public artistId: string,
        public collectionId: string,
        public tokenId: string
    ){}
}