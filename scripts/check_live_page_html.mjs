// Check what HTML is returned by the public pages
const BASE_URL = 'https://www.brightspaceinterior.in';

async function checkPages() {
  console.log('Fetching /portfolio...');
  const res1 = await fetch(`${BASE_URL}/portfolio?_t=${Date.now()}`);
  console.log('/portfolio status:', res1.status);
  console.log('x-vercel-cache:', res1.headers.get('x-vercel-cache'));
  console.log('cache-control:', res1.headers.get('cache-control'));
  const html1 = await res1.text();
  console.log('/portfolio HTML length:', html1.length);
  const title1Match = html1.match(/<h[123][^>]*>([^<]+)<\/h[123]>/g);
  console.log('/portfolio sample headings:', title1Match?.slice(0, 5));

  console.log('\nFetching /portfolio/rawls-salon-luxury...');
  const res2 = await fetch(`${BASE_URL}/portfolio/rawls-salon-luxury?_t=${Date.now()}`);
  console.log('/portfolio/rawls-salon-luxury status:', res2.status);
  console.log('x-vercel-cache:', res2.headers.get('x-vercel-cache'));
  console.log('cache-control:', res2.headers.get('cache-control'));
  const html2 = await res2.text();
  console.log('/portfolio/[slug] HTML length:', html2.length);
  const title2Match = html2.match(/<h1[^>]*>([^<]+)<\/h1>/);
  console.log('h1 on detail page:', title2Match ? title2Match[1] : 'none');

  // Also check if rawls is in html2
  const rawlsIndex = html2.indexOf('Rawls');
  if (rawlsIndex !== -1) {
    console.log('Snippet around Rawls:', html2.substring(rawlsIndex, rawlsIndex + 200));
  }
}

checkPages();
