import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class UrlImageToTextDto {
  @IsString()
  @IsNotEmpty()
  prompt: string;
}