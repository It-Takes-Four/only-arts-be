import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

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
  ];

  const tagMap = new Map<string, string>();
  for (const tagName of allTags) {
    const tag = await prisma.artTag.upsert({
      where: { tagName },
      update: {},
      create: {
        id: uuidv4(),
        tagName,
      },
    });
    tagMap.set(tag.tagName, tag.id);
  }

  const userList: { userId: string; artistId: string }[] = [];

  const templateUserId = uuidv4();
  const templateArtistId = uuidv4();
  const templatePassword = await bcrypt.hash('securePass1', 10);

  const templateUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      id: templateUserId,
      email: 'user@example.com',
      password: templatePassword,
      username: 'templateUser',
      profilePicture: null,
    },
  });

  const templateArtist = await prisma.artist.upsert({
    where: { userId: templateUser.id },
    update: {},
    create: {
      id: templateArtistId,
      userId: templateUser.id,
      artistName: 'TemplateArtist',
      bio: faker.lorem.sentence(),
      isNsfw: false,
    },
  });

  userList.push({ userId: templateUserId, artistId: templateArtistId });

  const numberOfArtists = faker.number.int({ min: 2, max: 5 });

  for (let i = 0; i < numberOfArtists; i++) {
    const userId = uuidv4();
    const artistId = uuidv4();
    const email = faker.internet.email();
    const username = faker.internet.userName();
    const plainPassword = faker.internet.password();
    const hashedPassword = bcrypt.hashSync(plainPassword, 10);

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        id: userId,
        email,
        password: hashedPassword,
        username,
        profilePicture: null,
      },
    });

    const artist = await prisma.artist.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        id: artistId,
        userId: user.id,
        artistName: faker.person.fullName(),
        bio: faker.lorem.paragraph(),
        isNsfw: faker.datatype.boolean(),
      },
    });

    userList.push({ userId, artistId });
  }

  for (const { userId, artistId } of userList) {
    const artId = uuidv4();

    const art = await prisma.art.upsert({
      where: { id: artId },
      update: {},
      create: {
        id: artId,
        imageUrl: faker.image.urlLoremFlickr({ category: 'art' }),
        description: faker.lorem.sentence(),
        artistId: artistId,
      },
    });

    const tagNames = faker.helpers.arrayElements(
      allTags,
      faker.number.int({ min: 2, max: 4 }),
    );
    for (const tagName of tagNames) {
      const tagId = tagMap.get(tagName)!;
      await prisma.artToArtTag.upsert({
        where: { artId_tagId: { artId: art.id, tagId } },
        update: {},
        create: { artId: art.id, tagId },
      });
    }

    const commenterCount = faker.number.int({ min: 1, max: 3 });
    const commenters = faker.helpers.arrayElements(userList, commenterCount);
    for (const commenter of commenters) {
      const comment = await prisma.comment.create({
        data: {
          id: uuidv4(),
          content: faker.lorem.sentences(),
          artId: art.id,
          userId: commenter.userId,
        },
      });

      await prisma.notification.create({
        data: {
          id: uuidv4(),
          userId,
          content: `New comment on your art by ${commenter.userId}`,
          artistId,
        },
      });
    }

    const collectionId = uuidv4();
    await prisma.artCollection.create({
      data: {
        id: collectionId,
        collectionName: faker.commerce.productName(),
        artistId,
      },
    });

    if (faker.datatype.boolean()) {
      await prisma.artToCollection.create({
        data: {
          id: uuidv4(),
          artId: artId,
          collectionId: collectionId,
        },
      });
    }

    await prisma.feed.create({
      data: {
        id: uuidv4(),
        artistId,
        title: faker.lorem.words(3),
        content: faker.lorem.paragraph(),
      },
    });
  }

  for (const user of userList) {
    const followTargets = faker.helpers.arrayElements(
      userList.filter((a) => a.artistId !== user.artistId),
      1,
    );

    for (const target of followTargets) {
      await prisma.follower.upsert({
        where: {
          userId_artistId: {
            userId: user.userId,
            artistId: target.artistId,
          },
        },
        update: {},
        create: {
          id: uuidv4(),
          userId: user.userId,
          artistId: target.artistId,
        },
      });

      await prisma.notification.create({
        data: {
          id: uuidv4(),
          userId: target.userId,
          artistId: target.artistId,
          content: `You have a new follower!`,
        },
      });
    }
  }

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
