import OpenAI from 'openai';

interface Options {
  prompt: string;
  lang: string;
}

export const translateUseCase = async (openai: OpenAI, options: Options) => {
  const { prompt, lang } = options;

  const response = await openai.responses.create({
    model: 'gpt-5.4',
    temperature: 0.4,
    max_output_tokens: 500,
    input: [
      {
        role: 'system',
        content: `Traduce el siguiente texto al idioma ${lang}: ${prompt}`,
      },
    ],
  });

  //console.log(response.output_text);
  return { message: response.output_text };
};
