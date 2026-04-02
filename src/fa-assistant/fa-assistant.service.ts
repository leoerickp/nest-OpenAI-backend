import { Injectable, InternalServerErrorException } from '@nestjs/common';
import OpenAI from 'openai';
import { checkCompleteStatusUseCase, createRunUseCase, createThreadUseCase, getMessageListUseCase, userQuestionUseCase } from './use-cases';
import { QuestionDto } from './dtos/question.dto';

@Injectable()
export class FaAssistantService {
  private openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async createThread() {
    return createThreadUseCase(this.openai);
  }

  async userQuestion(questionDto: QuestionDto) {
    const { threadId, question } = questionDto;
    const message = await userQuestionUseCase(this.openai, { threadId, question });
    const run = await createRunUseCase(this.openai, { threadId });
    
    const status = await checkCompleteStatusUseCase(this.openai, { threadId, runId: run.id });
    if(status !== 'completed') {
      throw new InternalServerErrorException('Run not completed');
    }

    const messages = await getMessageListUseCase(this.openai, { threadId });
    return messages.reverse();
  }
}
