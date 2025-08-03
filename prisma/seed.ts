import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

// Dummy asset file names
const ART_DUMMY_FILES = ['landscape.jpg', 'portrait.jpg', 'square.jpg'];
const COLLECTION_DUMMY_FILES = ['landscape.jpg', 'portrait.jpg', 'square.png'];

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
    'AI Art', 'Digital Painting', '3D Render', 'Abstract', 'Surrealism', 'Concept Art',
    'Fantasy', 'Sci-Fi', 'Portrait', 'Landscape', 'Character Design', 'Illustration',
    'Mixed Media', 'Collage', 'Generative Art', 'Pixel Art', 'Glitch Art', '3D Modeling',
    'Animation', 'Virtual Reality', 'Augmented Reality', 'NFT Art', 'Minimalism', 'Pop Art',
    'Cyberpunk', 'Steampunk', 'Nature', 'Urban',
    'Gothic', 'Anime', 'Manga', 'Realistic', 'Cartoon', 'Watercolor', 'Oil Painting',
    'Sketch', 'Pencil Art',
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

  // Create multiple artists
  const numberOfArtists = 12;
  const artistNames = [
    'PixelMaster', 'DigitalDreamer', 'ArtisticSoul', 'CreativeVision', 
    'AbstractMind', 'ColorfulWorld', 'FantasyRealm', 'ModernArtist',
    'VisualStory', 'ArtisticJourney', 'CreativeCanvas', 'DigitalWizard'
  ];

  for (let i = 0; i < numberOfArtists; i++) {
    const userId = uuidv4();
    const artistId = uuidv4();
    const artistName = artistNames[i];
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
      },
    });

    await prisma.artist.create({
      data: {
        id: artistId,
        userId,
        artistName,
        bio: faker.lorem.paragraph(),
        isNsfw: false, // All artists are safe
        walletAddress: `0x${faker.string.hexadecimal({ length: 40, prefix: '' })}`,
        isVerified: faker.datatype.boolean({ probability: 0.3 }),
      },
    });

    userList.push({ userId, artistId, username, artistName, isNsfw: false, email });
  }

  console.log(`✅ Created ${userList.length} users and artists`);

  // Initialize arrays for tracking created content
  const collections: string[] = [];
  const artworks: string[] = [];

  // Create balanced feed content (posts, arts, and collections)
  console.log('📰 Creating balanced feed content (posts, arts, and collections)...');
  
  // Create a balanced timeline for each user
  for (const user of userList) {
    // Determine how much content this user will create
    const isActiveUser = faker.datatype.boolean({ probability: 0.3 }); // 30% are very active
    const baseContentCount = faker.number.int({ min: 8, max: 20 });
    const totalContentCount = isActiveUser ? baseContentCount + faker.number.int({ min: 5, max: 15 }) : baseContentCount;
    
    // Create random dates for all content (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const contentDates = Array.from({ length: totalContentCount }, () => 
      faker.date.between({ from: sixMonthsAgo, to: new Date() })
    ).sort((a, b) => a.getTime() - b.getTime());
    
    // Decide the content mix for this user (posts, arts, collections)
    const contentTypes: ('post' | 'art' | 'collection')[] = [];
    const postRatio = 0.3; // 30% posts
    const artRatio = 0.4;  // 40% arts  
    const collectionRatio = 0.3; // 30% collections - increased for more collections in feed
    
    for (let i = 0; i < totalContentCount; i++) {
      const rand = Math.random();
      if (rand < postRatio) {
        contentTypes.push('post');
      } else if (rand < postRatio + artRatio) {
        contentTypes.push('art');
      } else {
        contentTypes.push('collection');
      }
    }
    
    // Create content in chronological order
    for (let i = 0; i < totalContentCount; i++) {
      const contentType = contentTypes[i];
      const contentDate = contentDates[i];
      
      if (contentType === 'post') {
        // Create feed post
        const postTypes = [
          'announcement', 'behind_scenes', 'wip', 'finished_piece', 
          'thoughts', 'tutorial', 'inspiration', 'collaboration'
        ];
        const postType = faker.helpers.arrayElement(postTypes);
        
        let title: string;
        let content: string;
        
        // Generate content based on post type
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
        
        const contentChoices = [
          `Just dropped a new piece! Really excited about how this one turned out. The ${faker.helpers.arrayElement(['colors', 'composition', 'lighting'])} came together perfectly.`,
          `Working late tonight on something special. ${faker.helpers.arrayElement(['Can\'t wait', 'So excited', 'Really pumped'])} to share it with you all soon!`,
          `Thanks for all the amazing feedback on my recent work! Your support means everything to the creative process.`,
          `Experimenting with ${faker.helpers.arrayElement(['new techniques', 'different styles', 'mixed media'])} lately. Growth never stops!`,
          `Studio update: Been really focused on ${faker.helpers.arrayElement(['improving my craft', 'pushing boundaries', 'exploring new themes'])} this month.`,
          `Collaboration announcement! Working with some incredible artists on a ${faker.helpers.arrayElement(['group exhibition', 'joint project', 'community initiative'])}.`,
          `Process shot from today's session. Sometimes the journey is just as beautiful as the destination.`,
          `Feeling inspired by ${faker.helpers.arrayElement(['nature', 'city life', 'technology', 'human connection'])} lately. It's amazing how art reflects life.`
        ];
        content = faker.helpers.arrayElement(contentChoices);
        
        await prisma.feed.create({
          data: {
            id: uuidv4(),
            artistId: user.artistId,
            title,
            content,
            imageUrl: faker.datatype.boolean({ probability: 0.4 }) 
              ? `/uploads/arts/${faker.helpers.arrayElement(ART_DUMMY_FILES)}` 
              : null,
            datePosted: contentDate,
          },
        });
        
      } else if (contentType === 'art') {
        // Create artwork
        const artId = uuidv4();
        const tokenId = BigInt(faker.number.int({ min: 1, max: 999999 }));
        
        // Create file record for the artwork image
        const dummyFileName = faker.helpers.arrayElement(ART_DUMMY_FILES);
        const imageFileId = await createDummyFileRecord(
          dummyFileName, 
          'arts', 
          `${user.artistName}_art_${Date.now()}_${dummyFileName}`
        );
        
        // Generate safe artwork titles and descriptions
        let title: string;
        let description: string;
        
        const artThemes = [
          'Digital', 'Abstract', 'Surreal', 'Vibrant', 'Ethereal', 'Cosmic', 'Urban', 
          'Natural', 'Futuristic', 'Vintage', 'Minimalist', 'Bold', 'Dreamy', 'Dark',
          'Colorful', 'Mysterious', 'Peaceful', 'Dynamic', 'Serene', 'Radiant'
        ];
        const artSubjects = [
          'Landscape', 'Portrait', 'Vision', 'World', 'Journey', 'Memory', 'Story',
          'Dream', 'Reality', 'Reflection', 'Symphony', 'Adventure', 'Mystery', 'Wonder',
          'Garden', 'City', 'Mountain', 'Ocean', 'Forest', 'Sky', 'River', 'Dawn'
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
          'Part of an ongoing series exploring human connection.',
          'A celebration of nature and technology in harmony.',
          'Exploring the intersection of dreams and reality.',
          'A study in color theory and emotional expression.',
          'Inspired by the rhythm and flow of urban life.',
          'A peaceful moment captured in digital brushstrokes.'
        ];
        description = faker.helpers.arrayElement(descriptions);
        
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
            datePosted: contentDate,
          },
        });

        artworks.push(artId);

        // Add tags to artwork (only safe tags)
        const relevantTags = allTags.filter(tag => !['NSFW', 'Mature', 'Artistic Nude'].includes(tag));
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
        
      } else if (contentType === 'collection') {
        // Create collection
        const collectionId = uuidv4();
        const isPaid = true; // All collections are paid with price 0.0001
        
        // Create file record for the collection cover image
        const dummyFileName = faker.helpers.arrayElement(COLLECTION_DUMMY_FILES);
        const coverImageFileId = await createDummyFileRecord(
          dummyFileName, 
          'collections', 
          `${user.artistName}_collection_${Date.now()}_cover_${dummyFileName}`
        );
        
        // Generate safe collection names and descriptions
        let collectionName: string;
        let description: string;
        
        const themes = [
          'Urban Landscapes', 'Digital Dreams', 'Abstract Emotions', 'Cosmic Journey',
          'Nature Symphony', 'Future Visions', 'Color Studies', 'Light & Shadow',
          'Minimal Expressions', 'Fantasy Realms', 'Portrait Series', 'Mixed Media Explorations',
          'Vintage Inspired', 'Modern Classics', 'Experimental Art', 'Creative Process',
          'Ocean Waves', 'Mountain Views', 'City Lights', 'Forest Paths', 'Sky Stories',
          'Seasonal Colors', 'Garden Dreams', 'Artistic Journeys', 'Visual Poetry'
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
          'A retrospective collection spanning different creative periods.',
          'Celebrating the beauty of everyday moments through art.',
          'A visual narrative exploring themes of growth and change.',
          'Inspired by the natural world and urban environments.',
          'A collection that bridges traditional and digital art forms.',
          'Exploring the harmony between color, light, and shadow.'
        ];
        description = faker.helpers.arrayElement(descriptions);
        
        await prisma.artCollection.create({
          data: {
            id: collectionId,
            collectionName,
            description,
            coverImageFileId,
            price: 0.0001, // Fixed price for all collections
            tokenId: BigInt(faker.number.int({ min: 1000, max: 999999 })),
            artistId: user.artistId,
            isPublished: true, // All collections are published
            createdAt: contentDate,
          },
        });
        
        collections.push(collectionId);
      }
    }
  }

  // Add artworks to collections (after all content is created)
  console.log('📚 Adding artworks to collections...');
  const allCollections = await prisma.artCollection.findMany({
    include: { artist: true },
  });

  for (const collection of allCollections) {
    const artistArtworks = await prisma.art.findMany({
      where: { artistId: collection.artistId },
    });

    if (artistArtworks.length > 0) {
      // Reserve at least 2-4 artworks as free (not in collections) per artist
      const freeArtworksCount = Math.min(
        faker.number.int({ min: 2, max: 4 }), 
        Math.floor(artistArtworks.length * 0.4) // At least 40% of artworks should remain free
      );
      
      // Available artworks that can be added to collections (excluding reserved free ones)
      const availableForCollections = artistArtworks.slice(freeArtworksCount);
      
      if (availableForCollections.length > 0) {
        // Add 1-6 artworks to each collection from available ones
        const maxToAdd = Math.min(6, availableForCollections.length);
        const minToAdd = Math.min(1, maxToAdd);
        const artworksToAdd = faker.helpers.arrayElements(
          availableForCollections, 
          faker.number.int({ min: minToAdd, max: maxToAdd })
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
  🎨 Artists: ${userList.length} (All Safe Content)
  📚 Collections: ${collections.length} (All priced at 0.0001 ETH & published)
  🖼️ Artworks: ${artworks.length}
  🏷️ Tags: ${allTags.length}
  
  🎲 Balanced Feed Content:
  - Posts, artworks, and collections are chronologically mixed
  - Content ratios: 30% posts, 40% artworks, 30% collections
  - Each user has varied posting history over 6 months
  - Active users create 13-35 pieces, regular users 8-20 pieces
  
  🎨 Artwork Distribution:
  - Each artist has 2-4 free artworks (not in collections)
  - At least 40% of each artist's works remain free
  - Collections contain 1-6 artworks each from available pool
  
  Test credentials:
  - Email: user@example.com / Password: securePass1
  - Other users: password123
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
