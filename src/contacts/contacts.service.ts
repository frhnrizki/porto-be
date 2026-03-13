import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../database/supabase.service';
import { CreateContactDto } from './dto/contact.dto';

@Injectable()
export class ContactsService {
  constructor(private readonly supabase: SupabaseService) {}

  async create(dto: CreateContactDto) {
    const { data, error } = await this.supabase
      .getClient()
      .from('contacts')
      .insert([dto])
      .select()
      .single();

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data;
  }

  async findAll() {
    const { data, error } = await this.supabase
      .getClient()
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new InternalServerErrorException(error.message);
    }

    return data;
  }
}
