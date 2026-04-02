import OpenAI from "openai";

interface Options{
  threadId: string;
  assistantId?: string;
}

export const createRunUseCase = async (openai: OpenAI, options: Options) => {
  const { threadId, assistantId } = options;
  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: assistantId || process.env.OPENAI_ASSISTANT_ID!,
    //! Overwrite the assistant instructions
    //instructions: 'Eres un asistente de IA experto en finanzas. Responde de manera clara y concisa.',
  });
  return run;
}