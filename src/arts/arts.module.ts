import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Art } from './entities/art.entity';
import { ArtService } from './arts.service';
import { ArtController } from './arts.controller';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Art, User])],
  controllers: [ArtController],
  providers: [ArtService],
})
export class ArtModule {}
