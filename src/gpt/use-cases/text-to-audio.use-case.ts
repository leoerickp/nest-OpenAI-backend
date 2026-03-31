import OpenAI from 'openai';
import * as path from 'path';
import fs from 'fs';

interface Options {
  prompt: string;
  voice?: string;
}

export const textToAudioUseCase = async (openai: OpenAI, options: Options) => {
  const { prompt, voice = 'nova' } = options;

  const voices = {
    'nova': 'nova',
    'alloy': 'alloy',
    'echo': 'echo',
    'fable': 'fable',
    'onyx': 'onyx',
    'shimmer': 'shimmer',
    'ash': 'ash',    
    'coral': 'coral',
    'sage': 'sage',    
  };

  const selectedVoice = voices[voice];

  const folderPath = path.resolve(__dirname, '../../../generated/audios');
  const speechFile = path.resolve(`${folderPath}/${new Date().getTime()}.mp3`);

  fs.mkdirSync(folderPath, { recursive: true });


  const mp3 = await openai.audio.speech.create({
    model: 'tts-1',
    voice: selectedVoice,
    input: prompt,
    response_format: 'mp3',
  });

  const buffer = Buffer.from(await mp3.arrayBuffer());
  fs.writeFileSync(speechFile, buffer);

  //console.log(mp3);
  return speechFile;
};
