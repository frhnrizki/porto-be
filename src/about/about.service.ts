import { Injectable, Logger } from '@nestjs/common';
import { SupabaseService } from '../database/supabase.service';
import { CreateExperienceDto, CreateStackDto, UpdateExperienceDto, UpdateStackDto } from './dto/about.dto';

@Injectable()
export class AboutService {
  private readonly logger = new Logger(AboutService.name);

  constructor(private supabase: SupabaseService) {}

  // Experiences
  async getExperiences() {
    const { data, error } = await this.supabase
      .getClient()
      .from('experiences')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      this.logger.error(`Error fetching experiences: ${error.message}`);
      throw error;
    }
    return data;
  }

  async createExperience(dto: CreateExperienceDto) {
    const { data, error } = await this.supabase
      .getClient()
      .from('experiences')
      .insert([dto])
      .select();

    if (error) {
      this.logger.error(`Error creating experience: ${error.message}`);
      throw error;
    }
    return data[0];
  }

  async updateExperience(id: string, dto: UpdateExperienceDto) {
    const { data, error } = await this.supabase
      .getClient()
      .from('experiences')
      .update(dto)
      .eq('id', id)
      .select();

    if (error) {
      this.logger.error(`Error updating experience: ${error.message}`);
      throw error;
    }
    return data[0];
  }

  async deleteExperience(id: string) {
    const { error } = await this.supabase
      .getClient()
      .from('experiences')
      .delete()
      .eq('id', id);

    if (error) {
      this.logger.error(`Error deleting experience: ${error.message}`);
      throw error;
    }
    return { success: true };
  }

  // Stacks
  async getStacks() {
    const { data, error } = await this.supabase
      .getClient()
      .from('stacks')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) {
      this.logger.error(`Error fetching stacks: ${error.message}`);
      throw error;
    }
    return data;
  }

  async createStack(dto: CreateStackDto) {
    const { data, error } = await this.supabase
      .getClient()
      .from('stacks')
      .insert([dto])
      .select();

    if (error) {
      this.logger.error(`Error creating stack: ${error.message}`);
      throw error;
    }
    return data[0];
  }

  async uploadIcon(file: any) {
    if (!file) {
      throw new Error('No file provided');
    }

    const supabase = this.supabase.getClient();

    // Generate unique filename
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const filePath = `stacks/${fileName}`;

    const { error } = await supabase.storage
      .from('portfolio-images')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      this.logger.error(`Failed to upload icon: ${error.message}`);
      throw error;
    }

    // Return public URL
    const { data: publicUrlData } = supabase.storage
      .from('portfolio-images')
      .getPublicUrl(filePath);

    return {
      url: publicUrlData.publicUrl,
    };
  }

  async updateStack(id: string, dto: UpdateStackDto) {
    const { data, error } = await this.supabase
      .getClient()
      .from('stacks')
      .update(dto)
      .eq('id', id)
      .select();

    if (error) {
      this.logger.error(`Error updating stack: ${error.message}`);
      throw error;
    }
    return data[0];
  }

  async deleteStack(id: string) {
    const { error } = await this.supabase
      .getClient()
      .from('stacks')
      .delete()
      .eq('id', id);

    if (error) {
      this.logger.error(`Error deleting stack: ${error.message}`);
      throw error;
    }
    return { success: true };
  }
}
