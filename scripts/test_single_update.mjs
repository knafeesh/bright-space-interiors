// Single update test to see what /portfolio and /portfolio/rawls-salon-luxury render
const BASE_URL = 'https://www.brightspaceinterior.in';

async function run() {
  // Login
  const loginRes = await fetch(`${BASE_URL}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'Azam', password: 'Azam@2005' })
  });
  const { token } = await loginRes.json();
  const setCookie = loginRes.headers.get('set-cookie') || '';
  const cookieMatch = setCookie.match(/bs_admin_session=([^;]+)/);
  const sessionCookie = cookieMatch ? cookieMatch[1] : token;

  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'Cookie': `bs_admin_session=${sessionCookie}`
  };

  // Get project 101
  const contentRes = await fetch(`${BASE_URL}/api/content?t=${Date.now()}`);
  const { projects } = await contentRes.json();
  const rawls = projects.find(p => p.id === 101 || p.slug === 'rawls-salon-luxury');

  console.log('Current Rawls in DB:', {
    title: rawls.title,
    location: rawls.location,
    area: rawls.area
  });

  const updatedRawls = {
    ...rawls,
    title: 'Rawls Salon Luxury Flagship LIVE TEST',
    location: 'Gurugram Sector 29 LIVE TEST',
    area: '5,500 sq ft LIVE TEST'
  };

  console.log('Updating Rawls in DB...');
  const putRes = await fetch(`${BASE_URL}/api/admin/portfolio`, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify(updatedRawls)
  });
  console.log('PUT status:', putRes.status);
  const putJson = await putRes.json();
  console.log('PUT result:', putJson);

  // Wait 1s
  await new Promise(r => setTimeout(r, 1000));

  // Check /api/content
  const verifyDb = await fetch(`${BASE_URL}/api/content?t=${Date.now()}`);
  const verifyJson = await verifyDb.json();
  const pDb = verifyJson.projects.find(p => p.id === 101);
  console.log('DB after PUT:', { title: pDb.title, location: pDb.location });

  // Now check /portfolio HTML
  const pageRes = await fetch(`${BASE_URL}/portfolio?t=${Date.now()}`, {
    headers: { 'Cache-Control': 'no-cache' }
  });
  const pageHtml = await pageRes.text();
  console.log('/portfolio contains "LIVE TEST":', pageHtml.includes('LIVE TEST'));
  console.log('/portfolio contains old title "Flagship Turnkey":', pageHtml.includes('Flagship Turnkey'));

  // Check /portfolio/rawls-salon-luxury HTML
  const detailRes = await fetch(`${BASE_URL}/portfolio/rawls-salon-luxury?t=${Date.now()}`, {
    headers: { 'Cache-Control': 'no-cache' }
  });
  const detailHtml = await detailRes.text();
  console.log('detail contains "LIVE TEST":', detailHtml.includes('LIVE TEST'));
  console.log('detail contains old title "Flagship Turnkey":', detailHtml.includes('Flagship Turnkey'));
  const h1Match = detailHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/);
  console.log('detail h1 tag:', h1Match ? h1Match[1].trim() : 'NONE');

  // Find where title appears in detailHtml
  const idx = detailHtml.indexOf('Rawls');
  if (idx !== -1) {
    console.log('Snippet around Rawls:', detailHtml.substring(idx - 50, idx + 150));
  }
}

run().catch(console.error);
