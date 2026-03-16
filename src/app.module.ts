import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './testimonials/projects/projects.module';
import { TestimonialsModule } from './testimonials/testimonials.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AboutModule } from './about/about.module';
import { ContactsModule } from './contacts/contacts.module';
import { SpotifyModule } from './spotify/spotify.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    ProjectsModule,
    TestimonialsModule,
    DashboardModule,
    AboutModule,
    ContactsModule,
    SpotifyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
