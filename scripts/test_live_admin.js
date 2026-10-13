// Test Firebase configuration status on live site
const https = require('https');

// First login to get a session cookie
function loginToAdmin() {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({ username: 'Azam', password: 'Azam@2005' });
    const req = https.request({
      hostname: 'www.brightspaceinterior.in',
      path: '/api/admin/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        const cookies = res.headers['set-cookie'] || [];
        const sessionCookie = cookies.find(c => c.includes('bs_admin_session'));
        resolve({ data: JSON.parse(data), cookie: sessionCookie });
      });
    });
    req.on('error', reject);
    req.write(payload);
    req.end();
  });
}

function getPortfolioStatus(cookie) {
  return new Promise((resolve, reject) => {
    https.get({
      hostname: 'www.brightspaceinterior.in',
      path: '/api/admin/portfolio',
      headers: { 'Cookie': cookie || '' }
    }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }); }
        catch (e) { resolve({ status: res.statusCode, body: data }); }
      });
    }).on('error', reject);
  });
}

async function run() {
  console.log('Step 1: Logging in to admin...');
  const { data, cookie } = await loginToAdmin();
  console.log('Login response:', JSON.stringify(data));
  console.log('Session cookie:', cookie ? 'RECEIVED' : 'NONE');
  
  if (!cookie) {
    console.log('ERROR: No session cookie — cannot test portfolio API');
    return;
  }
  
  console.log('\nStep 2: Checking portfolio API + Firebase status...');
  const cookieValue = cookie.split(';')[0];
  const result = await getPortfolioStatus(cookieValue);
  console.log('Portfolio API status:', result.status);
  console.log('storageStatus:', JSON.stringify(result.body.storageStatus));
  console.log('Projects count:', result.body.projects?.length);
  if (result.body.projects?.length > 0) {
    const p = result.body.projects[0];
    console.log('First project:', { id: p.id, title: p.title, category: p.category });
  }
}

run().catch(console.error);
