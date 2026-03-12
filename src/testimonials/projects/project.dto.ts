import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsArray,
  IsUrl,
  IsDateString,
} from 'class-validator';

export enum ProjectStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  process?: string;

  @IsString()
  @IsOptional()
  impact?: string;

  @IsString()
  @IsOptional()
  client?: string;

  @IsOptional()
  project_date?: string;

  @IsString()
  @IsOptional()
  image_url?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  gallery_urls?: string[];

  @IsString()
  @IsOptional()
  tech_stack?: string;

  @IsString()
  @IsOptional()
  project_url?: string;

  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;
}

export class UpdateProjectDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  process?: string;

  @IsString()
  @IsOptional()
  impact?: string;

  @IsString()
  @IsOptional()
  client?: string;

  @IsOptional()
  project_date?: string;

  @IsString()
  @IsOptional()
  image_url?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  gallery_urls?: string[];

  @IsString()
  @IsOptional()
  tech_stack?: string;

  @IsString()
  @IsOptional()
  project_url?: string;

  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;
}
