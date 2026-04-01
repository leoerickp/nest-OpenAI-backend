import * as fs from 'node:fs';
import OpenAI from "openai";
import { downloadImageAsPng } from 'src/helpers';

interface Options{
  prompt: string;
}

export const imageVariationUseCase = async (openai: OpenAI, options: Options) => {
  const { prompt } = options;

  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: `Create a variation of the provided image: ${prompt}`,
      n: 1,
      size: '1024x1024',
      quality: 'standard',
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