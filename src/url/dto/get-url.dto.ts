import { IsNotEmpty } from 'class-validator';

export class GetUrlDto {
  @IsNotEmpty()
  shortCode: string;
}