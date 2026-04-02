import OpenAI from "openai";

interface Options{
  threadId: string;
  runId: string;
}

export const checkCompleteStatusUseCase = async (openai: OpenAI, options: Options) => {
  const { threadId, runId } = options;
  const runStatus = await openai.beta.threads.runs.retrieve(runId, { thread_id: threadId });
  
  if(runStatus.status === 'completed' || runStatus.status === 'failed' || runStatus.status === 'cancelled' || runStatus.status === 'expired' || runStatus.status === 'requires_action' ) {
    return runStatus.status;
  }
  
  await sleep(1000);

  return await checkCompleteStatusUseCase(openai, options);
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
