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
  
  //fs.writeFileSync(filePath, buffer);

  await sharp(buffer)
    .png()
    .ensureAlpha()
    .resize(1024, 1024, { fit: 'fill' })
    .toFile(filePath);

  return fullPath ? filePath : fileNamePng;
}

export const downloadBase64ImageAsPng = async (base64Image: string, fullPath: boolean = false) => {

  // Remove header
  base64Image = base64Image.split(';base64,').pop() || '';
  const imageBuffer = Buffer.from(base64Image, 'base64');

  const folderPath = path.resolve('./', './generated/images/');
  fs.mkdirSync(folderPath, { recursive: true });

  const fileNamePng = `${ new Date().getTime() }-64.png`;
  
  const filePath = path.join(folderPath, fileNamePng);
  // transform to RGBA, png // This is what OpenAI expects
  await sharp(imageBuffer)
    .png()
    .ensureAlpha()
    .toFile(filePath);

  return fullPath ? filePath : fileNamePng;

}