const fs = require('fs');
const path = require('path');

async function verify() {
  const envPath = path.join(__dirname, '.env');
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  const lines = envContent.split('\n');
  let clientId = '';
  let clientSecret = '';
  let refreshToken = '';

  for (const line of lines) {
    if (line.startsWith('SPOTIFY_CLIENT_ID=')) clientId = line.split('=')[1].trim();
    if (line.startsWith('SPOTIFY_CLIENT_SECRET=')) clientSecret = line.split('=')[1].trim();
    if (line.startsWith('SPOTIFY_REFRESH_TOKEN=')) refreshToken = line.split('=')[1].trim();
  }

  console.log('--- Verification Script ---');
  console.log('Client ID:', clientId);
  console.log('Refresh Token Length:', refreshToken.length);
  console.log('Refresh Token Ends With:', refreshToken.slice(-10));

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', refreshToken);

    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    const data = await response.json();
    if (response.ok) {
      console.log('✅ SUCCESS! Token is valid.');
      console.log('Access Token obtained:', data.access_token.slice(0, 15) + '...');
    } else {
      console.error('❌ FAILED!');
      console.error('Status:', response.status);
      console.error('Error:', data);
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

verify();
