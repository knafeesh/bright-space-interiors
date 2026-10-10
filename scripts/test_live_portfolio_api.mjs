// Test live portfolio endpoints
const BASE_URL = 'https://www.brightspaceinterior.in';

async function checkDeployment() {
  console.log(`Checking deployment status at ${BASE_URL}...`);
  try {
    const res = await fetch(`${BASE_URL}/api/admin/portfolio`, {
      method: 'GET'
    });
    console.log(`Response status for /api/admin/portfolio:`, res.status);
    const text = await res.text();
    console.log(`Response body:`, text.substring(0, 300));
    return res.status;
  } catch (err) {
    console.error('Error fetching live endpoint:', err.message);
    return null;
  }
}

checkDeployment();
