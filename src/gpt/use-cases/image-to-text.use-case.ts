import * as fs from 'node:fs';
import OpenAI from "openai";
import { downloadBase64ImageAsPng } from 'src/helpers';

interface Options {
  prompt?: string;
  imageFile: Express.Multer.File;
}

const convertToBase64 = (file: Express.Multer.File) => {
  const data = fs.readFileSync(file.path);
  const base64 = Buffer.from(data).toString('base64');
  return `data:image/${file.mimetype.split('/')[1]};base64,${base64}`;
};

export const imageToTextUseCase = async (openai: OpenAI, options: Options) => {
  const { imageFile, prompt } = options;

  const base64Image = convertToBase64(imageFile);

  

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
          // {
          //   type: 'image_url',
          //   image_url: {
          //     url: 'https://static.vecteezy.com/system/resources/previews/003/623/626/non_2x/sunset-lake-landscape-illustration-free-vector.jpg',
          //   },
          // },
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

  const fileName = await downloadBase64ImageAsPng(base64Image);
  const url = `${process.env.BASE_URL}/api/gpt/image-generation/${fileName}`;  

  return { url, fileName, message: response.choices[0].message.content };
};