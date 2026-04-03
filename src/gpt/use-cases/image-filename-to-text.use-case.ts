import * as fs from 'node:fs';
import * as path from 'node:path';
import OpenAI from "openai";
import { downloadBase64ImageAsPng } from 'src/helpers';

interface Options {
  prompt: string;
  fileName: string;
}

const getFileNameFromUrl = (url: string) => {
  const pathname = new URL(url).pathname;
  return pathname.substring(pathname.lastIndexOf('/') + 1);
};

const convertFileNameImageToBase64 = (fileName: string) => {
  const filePath = path.resolve(__dirname, '../../../generated/images/', `${fileName}`);
  if (!fs.existsSync(filePath)) {
    throw new Error('File not found');
  }

  const data = fs.readFileSync(filePath);
  const base64 = Buffer.from(data).toString('base64');
  const ext = path.extname(fileName).replace('.', '');

  return `data:image/${ext};base64,${base64}`;
};

export const imageFileNameToTextUseCase = async (openai: OpenAI, options: Options) => {
  const { prompt, fileName } = options;

  const base64Image = convertFileNameImageToBase64(fileName);

  const response = await openai.chat.completions.create({
    model: 'gpt-4.1', //'gpt-4-vision-preview',
    max_tokens: 1000,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: prompt ?? '¿Qué logras ver en la imagen?',
          },
          {
            type: 'image_url',
            image_url: {
              url: base64Image,
            },
          },
        ],
      },
    ],
  });

  return { message: response.choices[0].message.content };
};