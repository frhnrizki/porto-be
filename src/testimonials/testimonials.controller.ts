import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TestimonialsService } from './testimonials.service';
import { CreateTestimonialDto, UpdateTestimonialDto } from './testimonial.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('testimonials')
export class TestimonialsController {
    constructor(private readonly testimonialsService: TestimonialsService) { }

    @Post()
    create(@Body() createTestimonialDto: CreateTestimonialDto) {
        // Anyone can submit a testimonial
        return this.testimonialsService.create(createTestimonialDto);
    }

    @Get()
    findAllPublic() {
        // Public endpoint to show approved testimonials
        return this.testimonialsService.findAllPublic();
    }

    @Get('admin')
    @UseGuards(JwtAuthGuard)
    findAllAdmin() {
        // Admin only endpoint to see all testimonials (including pending/rejected)
        return this.testimonialsService.findAllAdmin();
    }

    @Patch(':id/status')
    @UseGuards(JwtAuthGuard)
    updateStatus(@Param('id') id: string, @Body() updateTestimonialDto: UpdateTestimonialDto) {
        // Admin only endpoint to approve/reject
        return this.testimonialsService.updateStatus(id, updateTestimonialDto);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    remove(@Param('id') id: string) {
        return this.testimonialsService.remove(id);
    }
}
