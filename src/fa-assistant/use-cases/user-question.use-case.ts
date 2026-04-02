import OpenAI from "openai";

interface Options{
  threadId: string;
  question: string;
}

export const userQuestionUseCase = async (openai: OpenAI, options: Options) => {
  const { threadId, question } = options;
  const threadMessage = await openai.beta.threads.messages.create(threadId, {
    role: 'user',
    content: question,
  });
  return threadMessage;
}