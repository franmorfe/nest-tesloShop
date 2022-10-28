import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { Controller, Get, Post, Param, UploadedFile, UseInterceptors, BadRequestException, Res} from '@nestjs/common';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';
import { fileFilter, fileNamer } from './helpers';



@Controller('files')
export class FilesController {

  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ){}

  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ){
    const path = this.filesService.getStaticProductImage( imageName );
    res.sendFile( path );
  }


  @Post('product')
  @UseInterceptors( FileInterceptor('file', {
    fileFilter: fileFilter,
    storage: diskStorage({ 
      destination: './static/products',
      filename: fileNamer
    })
  }))
  uploadProductImage( 
    @UploadedFile() file: Express.Multer.File 
  ){
    if ( !file )
      throw new BadRequestException('Make sure the file is an image');

    const secureUrl = `${ this.configService.get('HOST_API') }/files/product/${ file.filename }`;
    return { secureUrl };
  }

}
