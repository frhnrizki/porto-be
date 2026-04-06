import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../database/supabase.service';
import { CreateTestimonialDto, UpdateTestimonialDto } from './testimonial.dto';

@Injectable()
export class TestimonialsService {
    constructor(private readonly supabaseService: SupabaseService) { }

    async create(createTestimonialDto: CreateTestimonialDto) {
        const supabase = this.supabaseService.getClient();
        // Default to approved for immediate visibility
        const payload = {
            ...createTestimonialDto,
            status: createTestimonialDto.status || 'approved',
        };

        const { data, error } = await supabase
            .from('testimonials')
            .insert([payload])
            .select()
            .single();

        if (error) {
            throw new InternalServerErrorException(error.message);
        }
        return data;
    }

    async findAllPublic() {
        const supabase = this.supabaseService.getClient();
        const { data, error } = await supabase
            .from('testimonials')
            .select('*')
            .eq('status', 'approved')
            .order('created_at', { ascending: false });

        if (error) {
            throw new InternalServerErrorException(error.message);
        }
        return data;
    }

    async findAllAdmin() {
        const supabase = this.supabaseService.getClient();
        const { data, error } = await supabase
            .from('testimonials')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            throw new InternalServerErrorException(error.message);
        }
        return data;
    }

    async updateStatus(id: string, updateTestimonialDto: UpdateTestimonialDto) {
        const supabase = this.supabaseService.getClient();

        const { data, error } = await supabase
            .from('testimonials')
            .update({ status: updateTestimonialDto.status })
            .eq('id', id)
            .select()
            .single();

        if (error || !data) {
            throw new NotFoundException(`Testimonial with ID ${id} not found or update failed`);
        }
        return data;
    }

    async remove(id: string) {
        const supabase = this.supabaseService.getClient();

        const { error } = await supabase
            .from('testimonials')
            .delete()
            .eq('id', id);

        if (error) {
            throw new InternalServerErrorException(error.message);
        }
        return { message: `Testimonial with ID ${id} deleted successfully` };
    }
}
