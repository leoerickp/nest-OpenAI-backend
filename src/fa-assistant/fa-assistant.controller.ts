import { Body, Controller, Post } from '@nestjs/common';
import { FaAssistantService } from './fa-assistant.service';
import { QuestionDto } from './dtos/question.dto';

@Controller('fa-assistant')
export class FaAssistantController {
  constructor(private readonly faAssistantService: FaAssistantService) {}

  @Post('create-thread')
  async createThread() {
    return this.faAssistantService.createThread();
  }

  @Post('user-question')
  async userQuestion(@Body() questionDto: QuestionDto) {
    return this.faAssistantService.userQuestion(questionDto);
  }
}
