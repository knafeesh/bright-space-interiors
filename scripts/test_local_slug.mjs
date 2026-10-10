import { getProjectsFromDb, getProjectFromDbBySlug } from '../src/lib/server/portfolio-db.ts';

async function test() {
  console.log('Testing getProjectsFromDb locally...');
  const projects = await getProjectsFromDb();
  console.log(`Fetched ${projects.length} projects.`);
  const rawls = await getProjectFromDbBySlug('rawls-salon-luxury');
  console.log('Rawls project from local db function:', {
    id: rawls?.id,
    title: rawls?.title,
    location: rawls?.location,
    area: rawls?.area
  });
}

test().catch(console.error);
