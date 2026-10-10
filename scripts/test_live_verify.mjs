// Direct live verification script
const BASE_URL = 'https://www.brightspaceinterior.in';

async function verify() {
  console.log('1. Logging in as admin...');
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

  const testProject = {
    id: 101,
    slug: 'rawls-salon-luxury',
    title: 'Rawls Salon — Flagship Luxury Salon & Academy',
    category: 'Salon',
    location: 'Sector 29, Gurugram NCR',
    area: '5,200 sq ft',
    year: '2025',
    duration: '14 weeks',
    status: 'Completed',
    featured: true,
    image: '/images/salon-rawls-reception.jpg',
    gallery: [
      '/images/salon-rawls-reception.jpg',
      '/images/salon-rawls-mainhall.jpg',
      '/images/salon-rawls-styling-suites.jpg',
      '/images/salon-rawls-facade-site.jpg'
    ],
    description: 'Complete turnkey facade engineering, MEP infrastructure, and opulent European interior execution for Rawls Salon. Features custom gold-leaf arched styling mirrors, geometric marble flooring, illuminated 3D crest branding, and artisanal carpet reception counter.',
    challenge: 'Executing multi-level structural facade modifications alongside bespoke joinery, acoustic privacy treatment suites, and high-efficiency central ventilation on schedule.',
    solution: 'Precision steel facade scaffolding reinforcement, handcrafted gold-leaf styling arches, Italian marble flooring, and customized retail vitrines.',
    clientQuote: 'The craftsmanship from the facade structure to the interior mirrors and reception desk is top-tier.',
    clientName: 'Rawls Salon Management',
    materials: [
      'Gold-Leaf Arched Framing',
      'Illuminated Crest Signage',
      'Checkerboard Marble',
      'Custom Carpet Reception Desk',
      'Double-Glazed Facade'
    ]
  };

  console.log('2. Sending PUT to /api/admin/portfolio...');
  const putRes = await fetch(`${BASE_URL}/api/admin/portfolio`, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify(testProject)
  });

  const putData = await putRes.json();
  console.log('PUT response:', putRes.status, putData.success, putData.message);

  console.log('3. Waiting 3 seconds for revalidation...');
  await new Promise(r => setTimeout(r, 3000));

  console.log('4. Fetching live project detail page: /portfolio/rawls-salon-luxury...');
  const detailRes = await fetch(`${BASE_URL}/portfolio/rawls-salon-luxury?_t=${Date.now()}`, {
    headers: { 'Cache-Control': 'no-cache' }
  });
  const detailHtml = await detailRes.text();

  console.log('\n--- DETAIL PAGE VERIFICATION ---');
  console.log('Title found:      ', detailHtml.includes('Rawls Salon — Flagship Luxury Salon & Academy'));
  console.log('Location found:   ', detailHtml.includes('Sector 29, Gurugram NCR'));
  console.log('Area found:       ', detailHtml.includes('5,200 sq ft'));
  console.log('Year found:       ', detailHtml.includes('2025'));
  console.log('Duration found:   ', detailHtml.includes('14 weeks'));
  console.log('Image found:      ', detailHtml.includes('/images/salon-rawls-reception.jpg'));

  console.log('\n5. Fetching live portfolio listing page: /portfolio...');
  const listRes = await fetch(`${BASE_URL}/portfolio?_t=${Date.now()}`, {
    headers: { 'Cache-Control': 'no-cache' }
  });
  const listHtml = await listRes.text();

  console.log('\n--- LISTING PAGE VERIFICATION ---');
  console.log('Title in listing:   ', listHtml.includes('Rawls Salon — Flagship Luxury Salon & Academy'));
  console.log('Location in listing:', listHtml.includes('Sector 29, Gurugram NCR'));
  console.log('Area in listing:    ', listHtml.includes('5,200 sq ft'));

  if (!detailHtml.includes('Sector 29, Gurugram NCR')) {
    console.log('\nDebug: Snippet around location in detailHtml:');
    const m = detailHtml.match(/<div class="project-meta-item__value">([\s\S]*?)<\/div>/g);
    console.log('Meta items on detail page:', m);
  }
}

verify().catch(console.error);
