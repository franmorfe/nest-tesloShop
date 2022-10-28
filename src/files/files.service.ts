import { join } from 'path';
import { Injectable, BadRequestException } from '@nestjs/common';
import { existsSync } from 'fs';

@Injectable()
export class FilesService {

  getStaticProductImage( imageName: string ) {

    const path = join(__dirname, '../../static/products', imageName);

    if ( !existsSync )
      throw new BadRequestException(`No product find with image ${ imageName }`);

    return path;

  }

}
