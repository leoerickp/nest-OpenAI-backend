import * as fs from 'node:fs';
import OpenAI from "openai";
import { downloadImageAsPng } from 'src/helpers';

interface Options{
  baseImage: string;
}

export const imageVariationUseCase = async (openai: OpenAI, options: Options) => {
  const { baseImage } = options;
  const pngImagePath = await downloadImageAsPng(baseImage, true);

  try {
    const response = await openai.images.createVariation({
      model: 'dall-e-2',
      image: fs.createReadStream(pngImagePath),
      n: 1,
      size: '1024x1024',
      response_format: 'url',
    }); 
  
    if(!response.data) {
      throw new Error('No image generated');
    }
  
    const variationFileName = await downloadImageAsPng(response.data[0].url!);
  
    const url = `${process.env.BASE_URL}/api/gpt/image-generation/${variationFileName}`;
  
    //console.log(response);
  
    return {
      url,
      openAIUrl: response.data[0].url,
      revisedPrompt: response.data[0].revised_prompt!,
    };
    
  } catch (error) {
    console.error('OpenAI error:', error);
  throw new Error('Image generation failed');
  }
}