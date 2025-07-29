import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

// Art image placeholder URLs for dummy data
const DUMMY_ART_IMAGES = [
  'https://picsum.photos/800/800?random=1',
  'https://picsum.photos/800/800?random=2',
  'https://picsum.photos/800/800?random=3',
  'https://picsum.photos/800/800?random=4',
  'https://picsum.photos/800/800?random=5',
  'https://picsum.photos/800/800?random=6',
  'https://picsum.photos/800/800?random=7',
  'https://picsum.photos/800/800?random=8',
  'https://picsum.photos/800/800?random=9',
  'https://picsum.photos/800/800?random=10',
  'https://picsum.photos/800/800?random=11',
  'https://picsum.photos/800/800?random=12',
  'https://picsum.photos/800/800?random=13',
  'https://picsum.photos/800/800?random=14',
  'https://picsum.photos/800/800?random=15',
  'https://picsum.photos/800/800?random=16',
  'https://picsum.photos/800/800?random=17',
  'https://picsum.photos/800/800?random=18',
  'https://picsum.photos/800/800?random=19',
  'https://picsum.photos/800/800?random=20',
];

const COLLECTION_COVER_IMAGES = [
  'https://picsum.photos/1200/600?random=21',
  'https://picsum.photos/1200/600?random=22',
  'https://picsum.photos/1200/600?random=23',
  'https://picsum.photos/1200/600?random=24',
  'https://picsum.photos/1200/600?random=25',
];

async function main() {
  console.log('🌱 Starting comprehensive seed...');

  // Clear existing data in the correct order to handle foreign key constraints
  console.log('🧹 Clearing existing data...');
  await prisma.artToArtTag.deleteMany();
  await prisma.artToCollection.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.artLike.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.follower.deleteMany();
  await prisma.feed.deleteMany();
  await prisma.art.deleteMany();
  await prisma.artCollection.deleteMany();
  await prisma.artist.deleteMany();
  await prisma.user.deleteMany();
  await prisma.artTag.deleteMany();

  // Art tags creation
  console.log('🏷️ Creating art tags...');
  const allTags = [
    'AI Art',
    'Digital Painting',
    '3D Render',
    'Abstract',
    'Surrealism',
    'Concept Art',
    'Fantasy',
    'Sci-Fi',
    'Portrait',
    'Landscape',
    'Character Design',
    'Illustration',
    'Mixed Media',
    'Collage',
    'Generative Art',
    'Pixel Art',
    'Glitch Art',
    '3D Modeling',
    'Animation',
    'Virtual Reality',
    'Augmented Reality',
    'NFT Art',
    'Minimalism',
    'Pop Art',
    'Cyberpunk',
    'Steampunk',
    'Nature',
    'Urban',
    'NSFW',
    'Mature',
    'Artistic Nude',
    'Gothic',
    'Anime',
    'Manga',
    'Realistic',
    'Cartoon',
    'Watercolor',
    'Oil Painting',
    'Sketch',
    'Pencil Art',
  ];

  const tagMap = new Map<string, string>();
  for (const tagName of allTags) {
    const tag = await prisma.artTag.create({
      data: {
        id: uuidv4(),
        tagName,
        usageCount: faker.number.int({ min: 0, max: 100 }),
      },
    });
    tagMap.set(tag.tagName, tag.id);
  }

  // Create users and artists
  console.log('👥 Creating users and artists...');
  const userList: { 
    userId: string; 
    artistId: string; 
    username: string; 
    artistName: string; 
    isNsfw: boolean;
    email: string;
  }[] = [];

  // Create template user and artist (non-NSFW)
  const templateUserId = uuidv4();
  const templateArtistId = uuidv4();
  const templatePassword = await bcrypt.hash('securePass1', 10);
  const templateEmail = 'user@example.com';
  const templateUsername = 'creativeUser';
  const templateArtistName = 'Artistic Visionary';

  await prisma.user.create({
    data: {
      id: templateUserId,
      email: templateEmail,
      password: templatePassword,
      username: templateUsername,
      profilePicture: 'https://picsum.photos/200/200?random=100',
    },
  });

  await prisma.artist.create({
    data: {
      id: templateArtistId,
      userId: templateUserId,
      artistName: templateArtistName,
      bio: 'Digital artist specializing in fantasy and concept art. Creating beautiful worlds through pixels.',
      isNsfw: false,
      walletAddress: `0x${faker.string.hexadecimal({ length: 40, prefix: '' })}`,
      isVerified: true,
    },
  });

  userList.push({ 
    userId: templateUserId, 
    artistId: templateArtistId, 
    username: templateUsername, 
    artistName: templateArtistName, 
    isNsfw: false,
    email: templateEmail
  });

  // Create multiple artists (both NSFW and non-NSFW)
  const numberOfArtists = 12;
  const nsfwArtists = ['NightshadeArt', 'SensualCanvas', 'EroticVisions', 'AdultArtistry'];
  const regularArtists = ['PixelMaster', 'DigitalDreamer', 'ArtisticSoul', 'CreativeVision', 'AbstractMind', 'ColorfulWorld', 'FantasyRealm', 'ModernArtist'];

  for (let i = 0; i < numberOfArtists; i++) {
    const userId = uuidv4();
    const artistId = uuidv4();
    const isNsfw = i < 4; // First 4 artists are NSFW
    const artistName = isNsfw ? nsfwArtists[i] : regularArtists[i - 4];
    const email = faker.internet.email().toLowerCase();
    const username = `user_${artistName.toLowerCase()}`;
    const plainPassword = 'password123';
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    await prisma.user.create({
      data: {
        id: userId,
        email,
        password: hashedPassword,
        username,
        profilePicture: `https://picsum.photos/200/200?random=${101 + i}`,
      },
    });

    await prisma.artist.create({
      data: {
        id: artistId,
        userId,
        artistName,
        bio: isNsfw 
          ? `Adult content creator specializing in mature artistic expressions. 18+ only.` 
          : faker.lorem.paragraph(),
        isNsfw,
        walletAddress: `0x${faker.string.hexadecimal({ length: 40, prefix: '' })}`,
        isVerified: faker.datatype.boolean({ probability: 0.3 }),
      },
    });

    userList.push({ userId, artistId, username, artistName, isNsfw, email });
  }

  console.log(`✅ Created ${userList.length} users and artists`);

  // Create art collections (both paid and free)
  console.log('🎨 Creating art collections...');
  const collections: string[] = [];
  
  for (const user of userList) {
    // Create 2-4 collections per artist
    const numCollections = faker.number.int({ min: 2, max: 4 });
    
    for (let j = 0; j < numCollections; j++) {
      const collectionId = uuidv4();
      const isPaid = faker.datatype.boolean({ probability: 0.6 }); // 60% chance of paid collection
      
      await prisma.artCollection.create({
        data: {
          id: collectionId,
          collectionName: user.isNsfw 
            ? `${faker.word.adjective()} ${faker.word.noun()} Collection`
            : `${faker.commerce.productAdjective()} ${faker.commerce.productMaterial()} Series`,
          description: user.isNsfw 
            ? 'Mature artistic content for adult audiences only. Contains nudity and adult themes.'
            : faker.lorem.paragraph(),
          coverImageUrl: faker.helpers.arrayElement(COLLECTION_COVER_IMAGES),
          price: isPaid ? faker.number.float({ min: 0.01, max: 5.0, fractionDigits: 2 }) : null,
          tokenId: isPaid ? BigInt(faker.number.int({ min: 1000, max: 999999 })) : null,
          artistId: user.artistId,
        },
      });
      
      collections.push(collectionId);
    }
  }

  console.log(`✅ Created ${collections.length} collections`);

  // Create many artworks
  console.log('🖼️ Creating artworks...');
  const artworks: string[] = [];
  
  for (const user of userList) {
    // Create 8-15 artworks per artist
    const numArtworks = faker.number.int({ min: 8, max: 15 });
    
    for (let k = 0; k < numArtworks; k++) {
      const artId = uuidv4();
      const tokenId = BigInt(faker.number.int({ min: 1, max: 999999 }));
      
      await prisma.art.create({
        data: {
          id: artId,
          title: user.isNsfw 
            ? `${faker.word.adjective()} ${faker.word.noun()} #${k + 1}`
            : faker.lorem.words(faker.number.int({ min: 2, max: 5 })),
          tokenId,
          imageUrl: faker.helpers.arrayElement(DUMMY_ART_IMAGES),
          description: user.isNsfw 
            ? 'Adult artistic content. Viewer discretion advised.'
            : faker.lorem.sentence(),
          artistId: user.artistId,
          likesCount: faker.number.int({ min: 0, max: 150 }),
          isInACollection: faker.datatype.boolean({ probability: 0.7 }),
        },
      });

      artworks.push(artId);

      // Add tags to artwork
      const relevantTags = user.isNsfw 
        ? allTags.filter(tag => ['NSFW', 'Mature', 'Artistic Nude'].includes(tag) || 
                             ['Portrait', 'Digital Painting', 'Illustration', 'Realistic'].includes(tag))
        : allTags.filter(tag => !['NSFW', 'Mature', 'Artistic Nude'].includes(tag));
      
      const artTags = faker.helpers.arrayElements(relevantTags, faker.number.int({ min: 2, max: 5 }));
      
      for (const tagName of artTags) {
        const tagId = tagMap.get(tagName);
        if (tagId) {
          await prisma.artToArtTag.create({
            data: {
              artId,
              tagId,
            },
          });
          
          // Update tag usage count
          await prisma.artTag.update({
            where: { id: tagId },
            data: { usageCount: { increment: 1 } },
          });
        }
      }
    }
  }

  console.log(`✅ Created ${artworks.length} artworks`);

  // Add artworks to collections
  console.log('📚 Adding artworks to collections...');
  const userCollections = await prisma.artCollection.findMany({
    include: { artist: true },
  });

  for (const collection of userCollections) {
    const artistArtworks = await prisma.art.findMany({
      where: { artistId: collection.artistId },
    });

    // Add 3-8 artworks to each collection
    const artworksToAdd = faker.helpers.arrayElements(
      artistArtworks, 
      faker.number.int({ min: 3, max: Math.min(8, artistArtworks.length) })
    );

    for (const artwork of artworksToAdd) {
      await prisma.artToCollection.create({
        data: {
          id: uuidv4(),
          artId: artwork.id,
          collectionId: collection.id,
        },
      });

      await prisma.art.update({
        where: { id: artwork.id },
        data: { isInACollection: true },
      });
    }
  }

  // Create follows between users
  console.log('👥 Creating follower relationships...');
  for (const user of userList) {
    const potentialFollows = userList.filter(u => u.artistId !== user.artistId);
    const followTargets = faker.helpers.arrayElements(
      potentialFollows, 
      faker.number.int({ min: 2, max: 8 })
    );

    for (const target of followTargets) {
      await prisma.follower.create({
        data: {
          id: uuidv4(),
          userId: user.userId,
          artistId: target.artistId,
        },
      });

      // Update follower count
      await prisma.artist.update({
        where: { id: target.artistId },
        data: { totalFollowers: { increment: 1 } },
      });

      // Create notification
      await prisma.notification.create({
        data: {
          id: uuidv4(),
          userId: target.userId,
          artistId: target.artistId,
          message: `${user.artistName} started following you!`,
        },
      });
    }
  }

  // Create comments on artworks
  console.log('💬 Creating comments...');
  const allArtworks = await prisma.art.findMany();
  
  for (const artwork of allArtworks) {
    const numComments = faker.number.int({ min: 1, max: 8 });
    const commenters = faker.helpers.arrayElements(userList, numComments);

    for (const commenter of commenters) {
      await prisma.comment.create({
        data: {
          id: uuidv4(),
          content: faker.lorem.sentences(faker.number.int({ min: 1, max: 3 })),
          artId: artwork.id,
          userId: commenter.userId,
        },
      });
    }
  }

  // Create art likes
  console.log('❤️ Creating art likes...');
  for (const artwork of allArtworks) {
    const numLikes = faker.number.int({ min: 0, max: 25 });
    const likers = faker.helpers.arrayElements(userList, numLikes);

    for (const liker of likers) {
      await prisma.artLike.create({
        data: {
          id: uuidv4(),
          userId: liker.userId,
          artId: artwork.id,
        },
      });
    }

    // Update likes count
    const totalLikes = await prisma.artLike.count({ where: { artId: artwork.id } });
    await prisma.art.update({
      where: { id: artwork.id },
      data: { likesCount: totalLikes },
    });
  }

  // Create feed posts
  console.log('📰 Creating feed posts...');
  for (const user of userList) {
    const numPosts = faker.number.int({ min: 3, max: 10 });
    
    for (let i = 0; i < numPosts; i++) {
      await prisma.feed.create({
        data: {
          id: uuidv4(),
          artistId: user.artistId,
          title: faker.lorem.words(faker.number.int({ min: 3, max: 8 })),
          content: faker.lorem.paragraphs(faker.number.int({ min: 1, max: 3 })),
          imageUrl: faker.datatype.boolean({ probability: 0.6 }) 
            ? faker.helpers.arrayElement(DUMMY_ART_IMAGES) 
            : null,
        },
      });
    }
  }

  // Create some purchases for paid collections
  console.log('💰 Creating purchases...');
  const paidCollections = await prisma.artCollection.findMany({
    where: { price: { not: null } },
  });

  for (const collection of paidCollections) {
    const numPurchases = faker.number.int({ min: 0, max: 5 });
    const buyers = faker.helpers.arrayElements(
      userList.filter(u => u.artistId !== collection.artistId), 
      numPurchases
    );

    for (const buyer of buyers) {
      await prisma.purchase.create({
        data: {
          id: uuidv4(),
          userId: buyer.userId,
          collectionId: collection.id,
          price: collection.price!,
          txHash: `0x${faker.string.hexadecimal({ length: 64, prefix: '' })}`,
          status: faker.helpers.arrayElement(['COMPLETED', 'PENDING', 'FAILED']),
          completedAt: faker.datatype.boolean({ probability: 0.8 }) 
            ? faker.date.recent({ days: 30 }) 
            : null,
        },
      });
    }
  }

  // Update artist statistics
  console.log('📊 Updating artist statistics...');
  for (const user of userList) {
    const artCount = await prisma.art.count({ where: { artistId: user.artistId } });
    const collectionCount = await prisma.artCollection.count({ where: { artistId: user.artistId } });

    await prisma.artist.update({
      where: { id: user.artistId },
      data: {
        totalArts: artCount,
        totalCollections: collectionCount,
      },
    });
  }

  console.log('✅ Seed completed successfully!');
  console.log(`
  📊 Summary:
  👥 Users: ${userList.length}
  🎨 Artists: ${userList.length} (${userList.filter(u => u.isNsfw).length} NSFW, ${userList.filter(u => !u.isNsfw).length} Regular)
  📚 Collections: ${collections.length}
  🖼️ Artworks: ${artworks.length}
  🏷️ Tags: ${allTags.length}
  
  📁 Storage folders created:
  - storage/uploads/arts (for uploaded art images)
  - storage/uploads/collections (for collection cover images)
  - storage/uploads/profiles (for profile pictures)
  - storage/dummy-assets/arts (for dummy/placeholder images)
  
  🔐 Test credentials:
  Template User:
  - Email: template@onlyarts.com
  - Password: securePass1
  
  Other users:
  - Password: password123 (for all generated users)
  `);
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
