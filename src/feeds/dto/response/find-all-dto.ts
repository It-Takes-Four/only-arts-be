export class Post {
    constructor(
       public artistId: string,
       public artistName: string,
       public artistProfileFileId: string|null,
       public content: string,
       public createdDate: Date
    ) {}
}

export class ArtFeed {
    constructor(
        public artistId: string,
        public artistName: string,
        public artistProfileFileId: string | null,
        public artDescription: string,
        public imageFileId: string,
        public artTitle: string,
        public createdDate: Date
    ) {}
}

export class ArtCollectionFeed {
    constructor(
        public artistId: string,
        public artistName: string,
        public artistProfileFileId: string|null,
        public collectionDescription: string|null,
        public coverImageFileId: string|null,
        public collectionTitle: string,
        public createdDate: Date
    ) {}
}

export class FindAllDtoResponse {
    constructor(
        public post: Post | null,
        public art: ArtFeed | null,
        public collection: ArtCollectionFeed | null,
        public createdDate: Date,
        public type: "art" | "collection" | "post"
    ) {}
}