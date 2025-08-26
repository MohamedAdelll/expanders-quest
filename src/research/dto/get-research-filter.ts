import { IsOptional, IsString, IsArray, IsNumber } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class GetResearchFilterDto {
  @IsOptional()
  @Transform(({ value }) =>
    (value as string).split(',').map((v: string) => v.trim()),
  )
  @IsArray()
  @IsString({ each: true })
  tag?: string[];

  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  project?: number;
}
