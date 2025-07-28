import {
    Controller,
    Get,
    Post,
    Delete,
    Patch,
    Body,
    Param,
    UsePipes,
    ValidationPipe,
    UseGuards,
} from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiTags,
    ApiOperation,
    ApiParam,
    ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CollectionAccessService } from './collection-access.service';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
@ApiTags('Collection Access')
@Controller('collection-access')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class CollectionAccessController {
    constructor(private readonly collectionAccessService: CollectionAccessService) { }
}
