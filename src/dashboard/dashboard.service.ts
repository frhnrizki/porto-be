import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../database/supabase.service';

@Injectable()
export class DashboardService {
    constructor(private readonly supabaseService: SupabaseService) { }

    async getMetrics() {
        const supabase = this.supabaseService.getClient();

        try {
            const { count: totalProjects, error: err1 } = await supabase
                .from('projects')
                .select('*', { count: 'exact', head: true });

            const { count: totalTestimonials, error: err2 } = await supabase
                .from('testimonials')
                .select('*', { count: 'exact', head: true });

            const { count: pendingTestimonials, error: err3 } = await supabase
                .from('testimonials')
                .select('*', { count: 'exact', head: true })
                .eq('status', 'pending');

            const { count: totalMessages, error: err4 } = await supabase
                .from('contacts')
                .select('*', { count: 'exact', head: true });

            if (err1 || err2 || err3 || err4) {
                throw new Error('Supabase query failed');
            }

            return {
                totalProjects: totalProjects || 0,
                totalTestimonials: totalTestimonials || 0,
                pendingTestimonials: pendingTestimonials || 0,
                totalMessages: totalMessages || 0,
            };
        } catch (e: any) {
            throw new InternalServerErrorException(e.message || 'Failed to fetch metrics');
        }
    }
}
