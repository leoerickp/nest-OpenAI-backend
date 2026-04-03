import { Body, Controller, FileTypeValidator, Get, HttpStatus, MaxFileSizeValidator, Param, ParseFilePipe, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { GptService } from './gpt.service';
import { OrthographyDto, ProsConsDicusserDto, TextToAudioDto, TranslateDto, AudioToTextDto, ImageGenerationDto, ImageVariationDto, ImageToTextDto, UrlImageToTextDto } from './dtos';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';

@Controller('gpt')
export class GptController {
  constructor(private readonly gptService: GptService) {}

  @Post('orthography-check')
  checkOrthography(@Body() orthographyDto: OrthographyDto) {
    return this.gptService.checkOrthography(orthographyDto);
  }

  @Post('pros-cons-discusser')
  prosConsDicusser(@Body() prosConsDicusserDto: ProsConsDicusserDto) {
    return this.gptService.prosConsDicusser(prosConsDicusserDto);
  }

  @Post('pros-cons-discusser-stream')
  async prosConsDicusserStream(@Body() prosConsDicusserDto: ProsConsDicusserDto, @Res() response: Response) {
    const stream = await this.gptService.prosConsDicusserStream(prosConsDicusserDto);

    response.setHeader('Content-Type', 'application/json');
    response.status(HttpStatus.OK);

    for await (const event of stream) {
      if (event.type === 'response.output_text.delta') {
        response.write(event.delta);
      }

      if (event.type === 'response.completed') {
        response.end();
      }
    }
  }

  @Post('translate')
  translate(@Body() translateDto: TranslateDto) {
    return this.gptService.translate(translateDto);
  }

  //Todo translate with stream

  @Post('text-to-audio')
  async textToAudio(@Body() textToAudioDto: TextToAudioDto, @Res() response: Response ) {
    const Mp3FilePath = await this.gptService.textToAudio(textToAudioDto);

    response.setHeader('Content-Type', 'audio/mpeg');
    response.status(HttpStatus.OK);
    response.sendFile(Mp3FilePath);
  }

  @Get('text-to-audio/:fileId')
  async textToAudioGetter(@Res() response: Response, @Param('fileId') fileId: string ) {
    const filePath = await this.gptService.getTextToAudio(fileId);
    response.setHeader('Content-Type', 'audio/mpeg');
    response.status(HttpStatus.OK);
    response.sendFile(filePath);
  }

  @Post('audio-to-text')
  @UseInterceptors(FileInterceptor('file',{
    storage: diskStorage({
      destination: './generated/uploads',
      filename: (req, file, callback) => {
        const fileExtension = file.originalname.split('.').pop();
        const fileName = `${randomUUID()}.${fileExtension}`;
        return callback(null, fileName);
      },
    }),
  }))
  async audioToText(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000 * 1024 * 5, message: 'File is too large, max 5MB' }),
          new FileTypeValidator({ 
            fileType: 'audio/*',            
            fallbackToMimetype: true,
           }),
        ],
      })
    ) file: Express.Multer.File,
    @Body() audioToTextDto: AudioToTextDto,
  ) {
    const result = await this.gptService.audioToText(file, audioToTextDto);
    return result;
  }

  @Post('image-generation')
  imageGeneration(@Body() imageGenerationDto: ImageGenerationDto) {
    return this.gptService.imageGeneration(imageGenerationDto);
  }

  @Get('image-generation/:filename')
  async getGeneratedImage(@Res() response: Response, @Param('filename') fileName: string ) {
    const filePath = await this.gptService.getGeneratedImage(fileName);
    response.setHeader('Content-Type', 'image/png');
    response.status(HttpStatus.OK);
    response.sendFile(filePath);
  }

  @Post('image-variation')
  imageVariation(@Body() imageVariationDto: ImageVariationDto) {
    return this.gptService.imageVariation(imageVariationDto);
  }

  @Post('extract-text-from-image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './generated/uploads',
        filename: (req, file, callback) => {
          const fileExtension = file.originalname.split('.').pop();
          const fileName = `${randomUUID()}.${fileExtension}`;
          return callback(null, fileName);
        },
      }),
    }),
  )
  async extractTextFromImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1000 * 1024 * 5,
            message: 'File is bigger than 5 mb ',
          }),
          new FileTypeValidator({
            fileType: 'image/*',
            fallbackToMimetype: true,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() imageToTextDto: ImageToTextDto,
  ) {
    return this.gptService.imageToText(file, imageToTextDto);
  }

  @Post('extract-text-from-url/:filename')
  async extractTextFromFileNameImage(@Body() urlImageToTextDto: UrlImageToTextDto, @Param('filename') fileName: string){
    return this.gptService.fileNameImageToText(urlImageToTextDto, fileName);
  }
}
