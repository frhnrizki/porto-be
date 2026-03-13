import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AboutService } from './about.service';
import { CreateExperienceDto, CreateStackDto, UpdateExperienceDto, UpdateStackDto } from './dto/about.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('about')
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Post('upload-icon')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  uploadIcon(@UploadedFile() file: any) {
    return this.aboutService.uploadIcon(file);
  }

  @Get('experiences')
  getExperiences() {
    return this.aboutService.getExperiences();
  }

  @UseGuards(JwtAuthGuard)
  @Post('experiences')
  createExperience(@Body() dto: CreateExperienceDto) {
    return this.aboutService.createExperience(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('experiences/:id')
  updateExperience(@Param('id') id: string, @Body() dto: UpdateExperienceDto) {
    return this.aboutService.updateExperience(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('experiences/:id')
  deleteExperience(@Param('id') id: string) {
    return this.aboutService.deleteExperience(id);
  }

  @Get('stacks')
  getStacks() {
    return this.aboutService.getStacks();
  }

  @UseGuards(JwtAuthGuard)
  @Post('stacks')
  createStack(@Body() dto: CreateStackDto) {
    return this.aboutService.createStack(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('stacks/:id')
  updateStack(@Param('id') id: string, @Body() dto: UpdateStackDto) {
    return this.aboutService.updateStack(id, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('stacks/:id')
  deleteStack(@Param('id') id: string) {
    return this.aboutService.deleteStack(id);
  }
}
