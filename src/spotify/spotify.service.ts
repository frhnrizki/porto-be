import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SpotifyService {
  private readonly logger = new Logger(SpotifyService.name);

  private readonly clientId: string;
  private readonly clientSecret: string;
  private readonly refreshToken: string;

  constructor(private configService: ConfigService) {
    this.clientId = this.configService.get<string>('SPOTIFY_CLIENT_ID', '');
    this.clientSecret = this.configService.get<string>('SPOTIFY_CLIENT_SECRET', '');
    this.refreshToken = this.configService.get<string>('SPOTIFY_REFRESH_TOKEN', '');
  }

  private async getAccessToken(): Promise<string> {
    const basicAuth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: this.refreshToken,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to get access token: ${response.statusText}`);
    }

    const data = await response.json();
    return data.access_token;
  }

  async getNowPlaying() {
    try {
      if (!this.clientId || !this.clientSecret || !this.refreshToken) {
        this.logger.warn('Spotify credentials are not configured');
        return { isPlaying: false };
      }

      const accessToken = await this.getAccessToken();

      const response = await fetch(
        'https://api.spotify.com/v1/me/player/currently-playing',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      // 204 = no content (nothing playing)
      if (response.status === 204 || response.status === 202) {
        return { isPlaying: false };
      }

      if (!response.ok) {
        this.logger.error(`Spotify API error: ${response.status} ${response.statusText}`);
        return { isPlaying: false };
      }

      const data = await response.json();
      this.logger.debug('Spotify Now Playing Data:', JSON.stringify(data));

      if (!data || !data.is_playing || !data.item) {
        return { isPlaying: false };
      }

      return {
        isPlaying: true,
        title: data.item.name,
        artist: data.item.artists.map((a: any) => a.name).join(', '),
        album: data.item.album.name,
        albumImageUrl: data.item.album.images?.[0]?.url ?? '',
        songUrl: data.item.external_urls?.spotify ?? '',
      };
    } catch (error) {
      this.logger.error(`Error fetching now playing: ${error.message}`);
      return { isPlaying: false };
    }
  }
}
