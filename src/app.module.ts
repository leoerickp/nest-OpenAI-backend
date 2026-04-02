import { Module } from '@nestjs/common';
import { GptModule } from './gpt/gpt.module';
import { ConfigModule } from '@nestjs/config';
import { FaAssistantModule } from './fa-assistant/fa-assistant.module';

@Module({
  imports: [ConfigModule.forRoot(), GptModule, FaAssistantModule],
})
export class AppModule {}
