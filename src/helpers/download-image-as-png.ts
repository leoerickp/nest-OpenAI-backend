import * as path from 'path';
import * as fs from 'node:fs';
import sharp from 'sharp';
import { randomUUID } from 'node:crypto';
import { InternalServerErrorException } from '@nestjs/common';

export const downloadImageAsPng = async (url: string, fullPath: boolean = false) => {
  const response = await fetch(url);
  
  if(!response.ok) {
    throw new InternalServerErrorException('Failed to download image');
  }

  const folderPath = path.resolve('./','./generated/images/');
  fs.mkdirSync(folderPath, { recursive: true });
  
  const fileNamePng = `${randomUUID()}.png`;
  const filePath = path.join(folderPath, fileNamePng);
  
  const buffer = Buffer.from(await response.arrayBuffer());
  
  const metadata = await sharp(buffer).metadata();

  if (!metadata.format) {
    throw new Error('Invalid image format');
  }
  //fs.writeFileSync(filePath, buffer);

  await sharp(buffer, { failOnError: true })
    .png({ quality: 100 })
    .ensureAlpha()
    .resize(1024, 1024, { fit: 'cover' })
    .toFile(filePath);
  
  const output = fs.readFileSync(filePath);
  if (output[0] !== 0x89 || output[1] !== 0x50) {
    throw new Error('Invalid PNG generated');
  }

  return fullPath ? filePath : fileNamePng;
}

export const downloadBase64ImageAsPng = async (base64Image: string, fullPath: boolean = false) => {

  // Remove header
  //base64Image = base64Image.split(';base64,').pop() || '';
  //const imageBuffer = Buffer.from(base64Image, 'base64');
  const matches = base64Image.match(/^data:image\/\w+;base64,(.+)$/);

  if (!matches) {
    throw new Error('Invalid base64 image format');
  }

  const imageBuffer = Buffer.from(matches[1], 'base64');
  const metadata = await sharp(imageBuffer).metadata();

  if (!metadata.format) {
    throw new Error('Invalid image format');
  }

  const folderPath = path.resolve('./', './generated/images/');
  fs.mkdirSync(folderPath, { recursive: true });

  const fileNamePng = `${randomUUID()}-64.png`;
  
  const filePath = path.join(folderPath, fileNamePng);
  // transform to RGBA, png // This is what OpenAI expects
  await sharp(imageBuffer, { failOnError: true })
    .png({ quality: 100 })
    .ensureAlpha()
    .resize(1024, 1024, { fit: 'cover' })
    .toFile(filePath);

  const output = fs.readFileSync(filePath);
  if (output[0] !== 0x89 || output[1] !== 0x50) {
    throw new Error('Invalid PNG generated');
  }

  return fullPath ? filePath : fileNamePng;

}