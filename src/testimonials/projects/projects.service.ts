import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../../database/supabase.service';
import { CreateProjectDto, UpdateProjectDto } from './project.dto';

@Injectable()
export class ProjectsService {
    constructor(private readonly supabaseService: SupabaseService) { }

    async create(createProjectDto: CreateProjectDto) {
        const supabase = this.supabaseService.getClient();
        const { data, error } = await supabase
            .from('projects')
            .insert([createProjectDto])
            .select()
            .single();

        if (error) {
            throw new InternalServerErrorException(error.message);
        }
        return data;
    }

    async findAll() {
        const supabase = this.supabaseService.getClient();
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            throw new InternalServerErrorException(error.message);
        }
        return data;
    }

    async findOne(id: string) {
        const supabase = this.supabaseService.getClient();
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
            throw new NotFoundException(`Project with ID ${id} not found`);
        }
        return data;
    }

    async update(id: string, updateProjectDto: UpdateProjectDto) {
        const supabase = this.supabaseService.getClient();

        // Check existence
        await this.findOne(id);

        const { data, error } = await supabase
            .from('projects')
            .update(updateProjectDto)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            throw new InternalServerErrorException(error.message);
        }
        return data;
    }

    async remove(id: string) {
        const supabase = this.supabaseService.getClient();

        // Check existence
        await this.findOne(id);

        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id);

        if (error) {
            throw new InternalServerErrorException(error.message);
        }
        return { message: `Project with ID ${id} deleted successfully` };
    }

    async uploadImage(file: Express.Multer.File) {
        if (!file) {
            throw new InternalServerErrorException('No file provided');
        }

        const supabase = this.supabaseService.getClient();

        // Generate unique filename
        const fileExt = file.originalname.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `projects/${fileName}`;

        const { data, error } = await supabase.storage
            .from('portfolio-images')
            .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: false,
            });

        if (error) {
            throw new InternalServerErrorException(`Failed to upload image: ${error.message}`);
        }

        // Return public URL
        const { data: publicUrlData } = supabase.storage
            .from('portfolio-images')
            .getPublicUrl(filePath);

        return {
            url: publicUrlData.publicUrl,
        };
    }
}
