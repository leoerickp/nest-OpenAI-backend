import OpenAI from 'openai';

interface Options {
  prompt: string;
}

export const prosConsDicusserUseCase = async (openai: OpenAI, options: Options) => {
  const { prompt } = options;

  const response = await openai.responses.create({
    model: 'gpt-5.4',
    temperature: 0.8, // more random
    max_output_tokens: 500,
    input: [
      {
        role: 'system',
        content: `
          Se te dará una pregunta y tu tarea es dar una respuesta con pros y contras,
          la respuesta debe de ser en formato markdown,
          los pros y contras deben de estar en una lista,
        `,
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  //console.log(response.output_text);
  return { content: response.output_text };
};
