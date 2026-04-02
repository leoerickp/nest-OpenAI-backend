import * as path from 'path';
import fs from 'fs';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  audioToTextUseCase,
  imageGenerationUseCase,
  imageToTextUseCase,
  imageVariationUseCase,
  orthographyCheckUseCase,
  prosConsDicusserStreamUseCase,
  prosConsDicusserUseCase,
  textToAudioUseCase,
  translateUseCase,
} from './use-cases';
import { AudioToTextDto, ImageGenerationDto, ImageVariationDto, OrthographyDto, ProsConsDicusserDto, TextToAudioDto, TranslateDto } from './dtos';
import OpenAI from 'openai';
import { OrthographyResponse } from './interfaces';

@Injectable()
export class GptService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  // Use use cases of OpenAI
  async checkOrthography(orthographyDto: OrthographyDto): Promise<OrthographyResponse> {
    const { prompt } = orthographyDto;
    return await orthographyCheckUseCase(this.openai, { prompt });
  }

  async prosConsDicusser(prosConsDicusserDto: ProsConsDicusserDto) {
    const { prompt } = prosConsDicusserDto;
    return await prosConsDicusserUseCase(this.openai, { prompt });
  }

  async prosConsDicusserStream(prosConsDicusserDto: ProsConsDicusserDto) {
    const { prompt } = prosConsDicusserDto;
    return await prosConsDicusserStreamUseCase(this.openai, { prompt });
  }

  async translate(translateDto: TranslateDto) {
    const { prompt, lang } = translateDto;
    return await translateUseCase(this.openai, { prompt, lang });
  }

  async textToAudio(textToAudioDto: TextToAudioDto) {
    const { prompt, voice } = textToAudioDto;
    return await textToAudioUseCase(this.openai, { prompt, voice });
  }

  async getTextToAudio(fileId: string) {
    const filePath = path.resolve(__dirname, '../../generated/audios/', `${fileId}.mp3`);
    
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(`File ${fileId} not found`);
    }

    return filePath;
  }

  async audioToText(audioFile: Express.Multer.File, audioToTextDto: AudioToTextDto) {
    const { prompt } = audioToTextDto;
    return await audioToTextUseCase(this.openai, { prompt, audioFile });
  }

  async imageGeneration(imageGenerationDto: ImageGenerationDto) {
    return await imageGenerationUseCase(this.openai, { ...imageGenerationDto });
  }

  async getGeneratedImage(fileName: string) {
    const filePath = path.resolve(__dirname, '../../generated/images/', `${fileName}`);
    
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException(`File ${fileName} not found`);
    }

    return filePath;
  }

  async imageVariation(imageVariationDto: ImageVariationDto) {
    return await imageVariationUseCase(this.openai, { prompt: imageVariationDto.prompt });
  }

  async imageToText(imageFile: Express.Multer.File, prompt: string) {
    return await imageToTextUseCase(this.openai, { imageFile, prompt });
  }
}
