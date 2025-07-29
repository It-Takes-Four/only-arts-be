export class Post {
    constructor(
       public artistId: string,
       public artistName: string,
       public artistProfileImage: Buffer|null,
       public content: string,
       public createdDate: Date
    ) {}
}

export class ArtFeed {
    constructor(
        public artistId: string,
        public artistName: string,
        public artistProfileImage: Buffer | null,
        public artDescription: string,
        public image: Buffer,
        public artTitle: string,
        public createdDate: Date
    ) {}
}

export class ArtCollectionFeed {
    constructor(
        public artistId: string,
        public artistName: string,
        public artistProfileImage: Buffer|null,
        public collectionDescription: string|null,
        public coverImage: Buffer|null,
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