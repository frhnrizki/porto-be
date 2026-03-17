const http = require('http');
const https = require('https');
const url = require('url');
const { exec } = require('child_process');

// ============================================
const CLIENT_ID = '13da2c20a76c4d31af79a4cbd7ddf6e3';
const CLIENT_SECRET = 'd0f648f377a8419b8925f0ce5720acac';
// ============================================

const PORT = 8888;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;
const SCOPES = 'user-read-currently-playing user-read-recently-played';

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);

  if (parsedUrl.pathname === '/callback') {
    const code = parsedUrl.query.code;
    
    if (code) {
      try {
        const tokenData = await exchangeCodeForToken(code);
        
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>Berhasil! Kembali ke terminal untuk melihat token Anda.</h1>');

        console.log('\n✅ BERHASIL! Salin data ini ke .env Anda:');
        console.log('----------------------------------------');
        console.log('SPOTIFY_REFRESH_TOKEN=' + tokenData.refresh_token);
        console.log('----------------------------------------\n');

        setTimeout(() => process.exit(0), 1000);
      } catch (err) {
        res.end('Error: ' + err.message);
        process.exit(1);
      }
    }
  }
});

server.listen(PORT, '127.0.0.1', () => {
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}&show_dialog=true`;
  console.log('\n🎵 Menunggu koneksi dari browser...');
  console.log('Buka URL ini jika tidak terbuka otomatis:\n' + authUrl);
  exec(`start "" "${authUrl}"`);
});

function exchangeCodeForToken(code) {
  return new Promise((resolve, reject) => {
    const postData = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: REDIRECT_URI,
    }).toString();

    const options = {
      hostname: 'accounts.spotify.com',
      path: '/api/token',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => resolve(JSON.parse(body)));
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}
