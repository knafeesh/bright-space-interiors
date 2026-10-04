import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const imagesDir = path.join(__dirname, "public", "images");

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

const images = [
  // Additional Projects
  {
    name: "project-showroom.jpg",
    url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "project-hotel.jpg",
    url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "project-salon.jpg",
    url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "project-turnkey.jpg",
    url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
  },

  // Project Gallery Details
  {
    name: "gallery-detail-1.jpg",
    url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "gallery-detail-2.jpg",
    url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "gallery-detail-3.jpg",
    url: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80",
  },

  // Services Hub & Detail
  {
    name: "service-residential.jpg",
    url: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "service-commercial.jpg",
    url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "service-turnkey.jpg",
    url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "service-design.jpg",
    url: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
  },

  // Specialty Disciplines
  {
    name: "specialty-lighting.jpg",
    url: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80",
  },
  {
    name: "specialty-flooring.jpg",
    url: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1000&q=80",
  },
  {
    name: "specialty-electrical.jpg",
    url: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=1000&q=80",
  },
  {
    name: "specialty-civil.jpg",
    url: "https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=1000&q=80",
  },
  {
    name: "specialty-ceiling.jpg",
    url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80",
  },
  {
    name: "specialty-painting.jpg",
    url: "https://images.unsplash.com/photo-1589834390005-5d4fb9bf3d32?auto=format&fit=crop&w=1000&q=80",
  },

  // About Studio & Team
  {
    name: "about-story.jpg",
    url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "about-hero.jpg",
    url: "https://images.unsplash.com/photo-1497215842964-222b430dc094?auto=format&fit=crop&w=1600&q=80",
  },
  {
    name: "team-anjali.jpg",
    url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "team-rohan.jpg",
    url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "team-priya.jpg",
    url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "team-karan.jpg",
    url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80",
  },
];

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const get = (targetUrl) => {
      https.get(targetUrl, (response) => {
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          return get(response.headers.location);
        }
        if (response.statusCode !== 200) {
          file.close();
          fs.unlinkSync(dest);
          return reject(new Error(`Failed with HTTP status ${response.statusCode}`));
        }
        response.pipe(file);
        file.on("finish", () => {
          file.close(() => resolve());
        });
      }).on("error", (err) => {
        file.close();
        if (fs.existsSync(dest)) fs.unlinkSync(dest);
        reject(err);
      });
    };
    get(url);
  });
}

async function run() {
  console.log("Starting bulk image downloads for Services, About, and Portfolio...");
  let successCount = 0;
  for (const img of images) {
    const dest = path.join(imagesDir, img.name);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      console.log(`- Already exists: ${img.name}`);
      successCount++;
      continue;
    }
    try {
      console.log(`Downloading ${img.name}...`);
      await download(img.url, dest);
      const stats = fs.statSync(dest);
      console.log(`✓ ${img.name} downloaded (${Math.round(stats.size / 1024)} KB)`);
      successCount++;
    } catch (err) {
      console.error(`✗ Failed to download ${img.name}:`, err.message);
    }
  }
  console.log(`Completed: ${successCount}/${images.length} images ready.`);
}

run();
