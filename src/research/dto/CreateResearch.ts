import { IsNumber, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateResearchDto {
  @IsNotEmpty()
  @IsNumber()
  projectId: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString({ each: true })
  tags?: string[];
}
