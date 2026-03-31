import * as fs from 'node:fs';
import path from 'node:path';
import OpenAI from "openai";
import { downloadBase64ImageAsPng, downloadImageAsPng } from "src/helpers";

interface Options{
  prompt: string;
  originalImage?: string;
  maskImage?: string;
}

export const imageGenerationUseCase = async (openai: OpenAI, options: Options) => {
  const { prompt, originalImage, maskImage } = options;

  if(!originalImage && !maskImage) {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
      response_format: 'url',
    });
  
  
    if(!response.data) {
      throw new Error('No image generated');
    }
  
    const fileName = await downloadImageAsPng(response.data[0].url!);

    const url = `${process.env.BASE_URL}/api/gpt/image-generation/${fileName}`;
  
    //console.log(response);
  
    return {
      url,
      openAIUrl: response.data[0].url,
      revisedPrompt: response.data[0].revised_prompt!,
    };
  }

  const pngImagePath = await downloadImageAsPng(originalImage!, true);
  const maskImagePath = await downloadBase64ImageAsPng(maskImage!, true);

  

  const response = await openai.images.edit({
    model: 'dall-e-3',
    prompt,
    image: fs.createReadStream(pngImagePath),
    mask: fs.createReadStream(maskImagePath),
    n: 1,
    size: '1024x1024',
    response_format: 'url',
  });

  if(!response.data) {
    throw new Error('No image generated');
  }

  const fileName = await downloadImageAsPng(response.data[0].url!);

  const url = `${process.env.BASE_URL}/api/gpt/image-generation/${fileName}`;
  
  return {
    url,
    openAIUrl: response.data[0].url,
    revisedPrompt: response.data[0].revised_prompt!,
  };
}