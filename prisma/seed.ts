import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Dummy asset file names
const ART_DUMMY_FILES = ['landscape.png', 'portrait.png', 'square.png'];
const COLLECTION_DUMMY_FILES = ['landscape.png', 'portrait.png', 'square.png'];

// Helper function to create file records from dummy assets
async function createDummyFileRecord(
  fileName: string, 
  type: 'arts' | 'collections' | 'profiles', 
  originalName?: string
): Promise<string> {
  const dummyAssetPath = path.join('./storage/dummy-assets', type, fileName);
  
  if (!fs.existsSync(dummyAssetPath)) {
    throw new Error(`Dummy asset not found: ${dummyAssetPath}`);
  }

  // Read the file to get its stats
  const stats = fs.statSync(dummyAssetPath);
  
  // Determine mimetype based on extension
  const ext = path.extname(fileName).toLowerCase();
  let mimetype = 'image/png';
  if (ext === '.jpg' || ext === '.jpeg') mimetype = 'image/jpeg';
  else if (ext === '.gif') mimetype = 'image/gif';
  else if (ext === '.webp') mimetype = 'image/webp';

  // Generate unique filename for storage
  const uniqueFileName = `${uuidv4()}${path.extname(fileName)}`;
  const uploadPath = path.join(`./storage/uploads/${type}`, uniqueFileName);

  // Ensure upload directory exists
  const uploadDir = path.dirname(uploadPath);
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Copy the dummy file to uploads directory
  fs.copyFileSync(dummyAssetPath, uploadPath);

  // Create file record in database
  const fileRecord = await prisma.file.create({
    data: {
      fileName: uniqueFileName,
      originalName: originalName || fileName,
      mimetype,
      size: stats.size,
      type: type,
    }
  });

  return fileRecord.id;
}

// Helper function to copy dummy assets to collections folder if they don't exist
function ensureDummyCollectionAssets(): void {
  const collectionsDir = './storage/dummy-assets/collections';
  const artsDir = './storage/dummy-assets/arts';
  
  if (!fs.existsSync(collectionsDir)) {
    fs.mkdirSync(collectionsDir, { recursive: true });
  }

  // Copy art dummy files to collections folder if they don't exist
  ART_DUMMY_FILES.forEach(fileName => {
    const sourcePath = path.join(artsDir, fileName);
    const destPath = path.join(collectionsDir, fileName);
    
    if (fs.existsSync(sourcePath) && !fs.existsSync(destPath)) {
      fs.copyFileSync(sourcePath, destPath);
    }
  });
}

async function main() {
  console.log('🌱 Starting comprehensive seed...');

  // Ensure dummy collection assets exist
  ensureDummyCollectionAssets();

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
  await prisma.file.deleteMany();

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
      // profilePicture: 'https://picsum.photos/200/200?random=100',
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
  const nsfwArtists = ['NightshadeArt', 'AbstractCanvas', 'AbstractVisions', 'AbstractArtistry'];
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
        // profilePicture: `https://picsum.photos/200/200?random=${101 + i}`,
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
  
  // Create a date range for collections (last 8 months, some older than arts)
  const eightMonthsAgo = new Date();
  eightMonthsAgo.setMonth(eightMonthsAgo.getMonth() - 8);
  
  for (const user of userList) {
    // Randomize number of collections per artist (some prolific, others minimal)
    const numCollections = faker.number.int({ min: 1, max: 6 });
    
    // Create random dates for this artist's collection releases
    const collectionDates = Array.from({ length: numCollections }, () => 
      faker.date.between({ from: eightMonthsAgo, to: new Date() })
    ).sort((a, b) => a.getTime() - b.getTime());
    
    for (let j = 0; j < numCollections; j++) {
      const collectionId = uuidv4();
      const isPaid = faker.datatype.boolean({ probability: 0.4 }); // Lower paid percentage for variety
      
      // Create file record for the collection cover image
      const dummyFileName = faker.helpers.arrayElement(COLLECTION_DUMMY_FILES);
      const coverImageFileId = await createDummyFileRecord(
        dummyFileName, 
        'collections', 
        `${user.artistName}_collection_${j + 1}_cover_${dummyFileName}`
      );
      
      // More creative collection names and descriptions
      let collectionName: string;
      let description: string;
      
      if (user.isNsfw) {
        const nsfwCollections = [
          'Midnight Collection', 'Intimate Gallery', 'Abstract Series', 'Private Vault',
          'After Hours Collection', 'Forbidden Art Series', 'Adult Anthology', 
          'Abstract Expressions', 'Secret Gallery', 'Passion Project'
        ];
        collectionName = faker.helpers.arrayElement(nsfwCollections);
        description = faker.helpers.arrayElement([
          'Mature artistic content for adult audiences only. Contains nudity and adult themes.',
          'An exclusive collection of intimate artistic expressions.',
          'Abstract art series exploring the beauty of human form.',
          'Adult-themed artwork collection. Adult viewers only.',
          'Private collection featuring mature artistic content.'
        ]);
      } else {
        const themes = [
          'Urban Landscapes', 'Digital Dreams', 'Abstract Emotions', 'Cosmic Journey',
          'Nature Symphony', 'Future Visions', 'Color Studies', 'Light & Shadow',
          'Minimal Expressions', 'Fantasy Realms', 'Portrait Series', 'Mixed Media Explorations',
          'Vintage Inspired', 'Modern Classics', 'Experimental Art', 'Creative Process'
        ];
        collectionName = faker.helpers.arrayElement(themes);
        
        const descriptions = [
          'A curated collection showcasing artistic evolution and creative expression.',
          'This series explores the intersection of technology and traditional art.',
          'A journey through color, form, and emotional landscapes.',
          'Limited collection featuring the artist\'s most compelling works.',
          'An exploration of contemporary themes through digital artistry.',
          'Handpicked pieces that represent a unique artistic vision.',
          'Collection inspired by nature, technology, and human experience.',
          'Artistic interpretation of modern life and digital culture.',
          'Experimental works pushing the boundaries of digital art.',
          'A retrospective collection spanning different creative periods.'
        ];
        description = faker.helpers.arrayElement(descriptions);
      }
      
      await prisma.artCollection.create({
        data: {
          id: collectionId,
          collectionName,
          description,
          coverImageFileId,
          price: isPaid ? faker.number.float({ min: 0.05, max: 12.0, fractionDigits: 2 }) : null,
          tokenId: isPaid ? BigInt(faker.number.int({ min: 1000, max: 999999 })) : null,
          artistId: user.artistId,
          isPublished: faker.datatype.boolean({ probability: 0.8 }), // Some unpublished for variety
          createdAt: collectionDates[j], // Use random date
        },
      });
      
      collections.push(collectionId);
    }
  }

  console.log(`✅ Created ${collections.length} collections`);

  // Create many artworks
  console.log('🖼️ Creating artworks...');
  const artworks: string[] = [];
  
  // Create a base date range for more varied posting dates (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  for (const user of userList) {
    // Randomize number of artworks per artist for more variation
    const numArtworks = faker.number.int({ min: 5, max: 20 });
    
    // Create random dates for this artist's posting history
    const userPostDates = Array.from({ length: numArtworks }, () => 
      faker.date.between({ from: sixMonthsAgo, to: new Date() })
    ).sort((a, b) => a.getTime() - b.getTime()); // Sort chronologically
    
    for (let k = 0; k < numArtworks; k++) {
      const artId = uuidv4();
      const tokenId = BigInt(faker.number.int({ min: 1, max: 999999 }));
      
      // Create file record for the artwork image
      const dummyFileName = faker.helpers.arrayElement(ART_DUMMY_FILES);
      const imageFileId = await createDummyFileRecord(
        dummyFileName, 
        'arts', 
        `${user.artistName}_art_${k + 1}_${dummyFileName}`
      );
      
      // More varied titles and descriptions
      let title: string;
      let description: string;
      
      if (user.isNsfw) {
        const nsfwTitles = [
          'Midnight Passion', 'Abstract Dreams', 'Forbidden Art', 'Abstract Fantasy',
          'Erotic Expression', 'Intimate Moments', 'Mature Beauty', 'Seductive Vision',
          'Private Collection', 'After Dark', 'Tempting Art', 'Sultry Creation'
        ];
        title = `${faker.helpers.arrayElement(nsfwTitles)} #${k + 1}`;
        description = faker.helpers.arrayElement([
          'Adult artistic content. Viewer discretion advised.',
          'Mature artistic expression exploring human ideas.',
          'This piece contains adult themes and nudity.',
          'An intimate exploration of form and desire.',
          'Artistic nude study.',
          'Abstract art piece for mature audiences.'
        ]);
      } else {
        const artThemes = [
          'Digital', 'Abstract', 'Surreal', 'Vibrant', 'Ethereal', 'Cosmic', 'Urban', 
          'Natural', 'Futuristic', 'Vintage', 'Minimalist', 'Bold', 'Dreamy', 'Dark'
        ];
        const artSubjects = [
          'Landscape', 'Portrait', 'Vision', 'World', 'Journey', 'Memory', 'Story',
          'Dream', 'Reality', 'Reflection', 'Symphony', 'Adventure', 'Mystery', 'Wonder'
        ];
        title = `${faker.helpers.arrayElement(artThemes)} ${faker.helpers.arrayElement(artSubjects)}`;
        
        const descriptions = [
          'A captivating piece that explores the boundaries of imagination.',
          'This artwork represents a journey through color and form.',
          'An experimental piece blending traditional and digital techniques.',
          'Inspired by the beauty of everyday moments.',
          'A visual narrative that speaks to the soul.',
          'Created during a period of artistic exploration.',
          'This piece challenges conventional artistic norms.',
          'A meditation on light, shadow, and emotion.',
          'Combining elements of realism with abstract expression.',
          'Part of an ongoing series exploring human connection.'
        ];
        description = faker.helpers.arrayElement(descriptions);
      }
      
      await prisma.art.create({
        data: {
          id: artId,
          title,
          tokenId,
          imageFileId,
          description,
          artistId: user.artistId,
          likesCount: faker.number.int({ min: 0, max: 250 }),
          isInACollection: faker.datatype.boolean({ probability: 0.6 }),
          datePosted: userPostDates[k], // Use the random date for this artwork
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
    // Vary posting frequency - some artists are more active
    const basePostCount = faker.number.int({ min: 2, max: 15 });
    const isActiveUser = faker.datatype.boolean({ probability: 0.3 }); // 30% are very active
    const numPosts = isActiveUser ? basePostCount + faker.number.int({ min: 5, max: 10 }) : basePostCount;
    
    // Create random dates for posts (last 4 months)
    const fourMonthsAgo = new Date();
    fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);
    const postDates = Array.from({ length: numPosts }, () => 
      faker.date.between({ from: fourMonthsAgo, to: new Date() })
    ).sort((a, b) => a.getTime() - b.getTime());
    
    for (let i = 0; i < numPosts; i++) {
      // More varied post content
      const postTypes = [
        'announcement', 'behind_scenes', 'wip', 'finished_piece', 
        'thoughts', 'tutorial', 'inspiration', 'collaboration'
      ];
      const postType = faker.helpers.arrayElement(postTypes);
      
      let title: string;
      let content: string;
      
      // Generate content based on post type and user type
      if (user.isNsfw) {
        const nsfwTitles: Record<string, string> = {
          announcement: 'New Adult Collection Available',
          behind_scenes: 'Behind the Scenes: Creating Intimate Art',
          wip: 'Work in Progress - Mature Content',
          finished_piece: 'Latest Piece Complete',
          thoughts: 'Thoughts on Artistic Expression',
          tutorial: 'Artistic Techniques Discussion',
          inspiration: 'Finding Inspiration',
          collaboration: 'Collaboration Announcement'
        };
        title = nsfwTitles[postType] || 'Artist Update';
        content = faker.helpers.arrayElement([
          'Working on some new pieces for my private collection. Exploring new themes and techniques.',
          'Just finished a challenging piece that pushed my artistic boundaries. 18+ content ahead.',
          'Thank you all for the amazing support! New artwork coming soon.',
          'Experimenting with different lighting techniques in my latest series.',
          'Behind the scenes look at my creative process. More to come!',
        ]);
      } else {
        const regularTitles: Record<string, string> = {
          announcement: `New ${faker.helpers.arrayElement(['Collection', 'Series', 'Project'])} Announcement`,
          behind_scenes: `Behind the Scenes: ${faker.helpers.arrayElement(['My Process', 'Studio Life', 'Creative Journey'])}`,
          wip: `Work in Progress: ${faker.helpers.arrayElement(['New Piece', 'Digital Art', 'Experimental Work'])}`,
          finished_piece: `Just Finished: ${faker.helpers.arrayElement(['Latest Creation', 'New Artwork', 'Digital Piece'])}`,
          thoughts: `Thoughts on ${faker.helpers.arrayElement(['Digital Art', 'Creativity', 'Artistic Growth'])}`,
          tutorial: `${faker.helpers.arrayElement(['Tips', 'Tutorial', 'Technique'])} for ${faker.helpers.arrayElement(['Digital Artists', 'Beginners', 'Creators'])}`,
          inspiration: `Finding Inspiration in ${faker.helpers.arrayElement(['Nature', 'Technology', 'Everyday Life'])}`,
          collaboration: `Exciting Collaboration with ${faker.person.firstName()}`
        };
        title = regularTitles[postType] || faker.lorem.words(faker.number.int({ min: 3, max: 8 }));
        
        const contentTypes = [
          `Just dropped a new piece! Really excited about how this one turned out. The ${faker.helpers.arrayElement(['colors', 'composition', 'lighting'])} came together perfectly.`,
          `Working late tonight on something special. ${faker.helpers.arrayElement(['Can\'t wait', 'So excited', 'Really pumped'])} to share it with you all soon!`,
          `Thanks for all the amazing feedback on my recent work! Your support means everything to the creative process.`,
          `Experimenting with ${faker.helpers.arrayElement(['new techniques', 'different styles', 'mixed media'])} lately. Growth never stops!`,
          `Studio update: Been really focused on ${faker.helpers.arrayElement(['improving my craft', 'pushing boundaries', 'exploring new themes'])} this month.`,
          `Collaboration announcement! Working with some incredible artists on a ${faker.helpers.arrayElement(['group exhibition', 'joint project', 'community initiative'])}.`,
          `Process shot from today's session. Sometimes the journey is just as beautiful as the destination.`,
          `Feeling inspired by ${faker.helpers.arrayElement(['nature', 'city life', 'technology', 'human connection'])} lately. It's amazing how art reflects life.`
        ];
        content = faker.helpers.arrayElement(contentTypes);
      }
      
      await prisma.feed.create({
        data: {
          id: uuidv4(),
          artistId: user.artistId,
          title,
          content,
          imageUrl: faker.datatype.boolean({ probability: 0.4 }) 
            ? `/uploads/arts/${faker.helpers.arrayElement(ART_DUMMY_FILES)}` 
            : null,
          datePosted: postDates[i], // Use random date
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
  - storage/uploads/arts (for uploaded art images with file records)
  - storage/uploads/collections (for collection cover images with file records)
  - storage/uploads/profiles (for profile pictures)
  - storage/dummy-assets/arts (dummy images: landscape.png, portrait.png, square.png)
  - storage/dummy-assets/collections (dummy images: landscape.png, portrait.png, square.png)
  
  🗄️ File system integration:
  - All artworks now have proper File records linked via imageFileId
  - All collections now have proper File records linked via coverImageFileId
  - File uploads are handled through the FileUploadService
  - Dummy assets are copied to uploads folder and tracked in database
  
  🎲 Randomization improvements:
  - Artworks: Varied creation dates (last 6 months), realistic titles, diverse descriptions
  - Collections: Randomized dates (last 8 months), creative names, mixed pricing
  - Feed posts: Different posting frequencies, varied content types, realistic timestamps
  - Artists: Some very active (15+ posts), others minimal (2-5 posts)
  - Content: Context-aware titles and descriptions based on artist type (NSFW/Regular)
  
  🔐 Test credentials:
  Template User:
  - Email: user@example.com
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
    void prisma.$disconnect();
  });
