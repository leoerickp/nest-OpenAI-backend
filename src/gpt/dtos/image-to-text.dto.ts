import { IsNotEmpty, IsString } from "class-validator";

export class ImageToTextDto {
  @IsString()
  @IsNotEmpty()
  prompt: string;
}