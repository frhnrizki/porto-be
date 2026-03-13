import { IsString, IsNotEmpty, IsOptional, IsInt, IsEnum } from 'class-validator';

export class CreateExperienceDto {
  @IsString()
  @IsNotEmpty()
  role: string;

  @IsString()
  @IsNotEmpty()
  company: string;

  @IsString()
  @IsNotEmpty()
  date_range: string;

  @IsInt()
  @IsOptional()
  order_index?: number;
}

export class CreateStackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsOptional()
  caption?: string;

  @IsString()
  @IsOptional()
  icon_url?: string;

  @IsEnum(['Design', 'Code', 'Tools'])
  category: string;

  @IsInt()
  @IsOptional()
  order_index?: number;
}
export class UpdateExperienceDto {
  @IsString()
  @IsOptional()
  role?: string;

  @IsString()
  @IsOptional()
  company?: string;

  @IsString()
  @IsOptional()
  date_range?: string;

  @IsInt()
  @IsOptional()
  order_index?: number;
}

export class UpdateStackDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  caption?: string;

  @IsString()
  @IsOptional()
  icon_url?: string;

  @IsEnum(['Design', 'Code', 'Tools'])
  @IsOptional()
  category?: string;

  @IsInt()
  @IsOptional()
  order_index?: number;
}
