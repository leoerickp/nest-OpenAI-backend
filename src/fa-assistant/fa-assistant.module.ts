import { Module } from '@nestjs/common';
import { FaAssistantService } from './fa-assistant.service';
import { FaAssistantController } from './fa-assistant.controller';

@Module({
  controllers: [FaAssistantController],
  providers: [FaAssistantService],
})
export class FaAssistantModule {}
