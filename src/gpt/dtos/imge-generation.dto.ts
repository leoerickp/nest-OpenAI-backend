import { IsOptional, IsString } from 'class-validator';

export class ImageGenerationDto {
  @IsString()
  readonly prompt: string;

  @IsOptional()
  @IsString()
  readonly originalImage?: string;

  @IsOptional()
  @IsString()
  readonly maskImage?: string;
}
