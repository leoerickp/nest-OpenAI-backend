import { IsBase64, IsNotEmpty, IsString } from "class-validator";

export class ImageVariationDto {
  @IsString()
  @IsNotEmpty()
  baseImage: string;
}