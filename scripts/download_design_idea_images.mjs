import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const targetDir = path.join(__dirname, "..", "public", "images", "design-ideas");

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Curated Unsplash IDs for interior photography
const photoMap = {
  // Crockery Unit
  "crockery-hero": "photo-1556911220-e15b29be8c8f",
  "crockery-1": "photo-1595526114035-0d45ed16cfbf",
  "crockery-2": "photo-1616486338812-3dadae4b4ace",
  "crockery-3": "photo-1600585154340-be6161a56a0c",
  "crockery-4": "photo-1616046229478-9901c5536a45",
  "crockery-5": "photo-1556912172-45b7abe8b7e1",
  "crockery-6": "photo-1600566753190-17f0baa2a6c3",

  // Modular Kitchen
  "kitchen-hero": "photo-1556911220-e15b29be8c8f",
  "kitchen-1": "photo-1600585154526-990dced4db0d",
  "kitchen-2": "photo-1507089947368-19c1da9775ae",
  "kitchen-3": "photo-1600566753086-00f18fb6b3ea",
  "kitchen-4": "photo-1556909212-d5b604d0c90d",
  "kitchen-5": "photo-1556912998-c57cc6b63cd7",
  "kitchen-6": "photo-1600607687939-ce8a6c25118c",

  // Dining Room
  "dining-hero": "photo-1617806118233-18e1de247200",
  "dining-1": "photo-1617806118233-18e1de247200",
  "dining-2": "photo-1533090161767-e6ffed986c88",
  "dining-3": "photo-1615066390971-03e4e1c36ddf",
  "dining-4": "photo-1594026112284-02bb6f3352fe",
  "dining-5": "photo-1517248135467-4c7edcad34c4",
  "dining-6": "photo-1544457070-4cd773b4d71e",

  // Master Bedroom
  "bedroom-hero": "photo-1616594039964-ae9021a400a0",
  "bedroom-1": "photo-1616594039964-ae9021a400a0",
  "bedroom-2": "photo-1595526114035-0d45ed16cfbf",
  "bedroom-3": "photo-1540518614846-7ede433c4b13",
  "bedroom-4": "photo-1560185127-6ed189bf02f4",
  "bedroom-5": "photo-1505693416388-ac5ce068fe85",
  "bedroom-6": "photo-1598928506311-c55ded91a20c",

  // False Ceiling
  "ceiling-hero": "photo-1513694203232-719a280e022f",
  "ceiling-1": "photo-1600210492486-724fe5c67fb0",
  "ceiling-2": "photo-1600607687644-c7171b42498f",
  "ceiling-3": "photo-1600585152220-90363fe7e115",
  "ceiling-4": "photo-1507473885765-e6ed057f782c",
  "ceiling-5": "photo-1513519245088-0e12902e5a38",
  "ceiling-6": "photo-1512917774080-9991f1c4c750",

  // Wardrobe
  "wardrobe-hero": "photo-1558997519-83ea9252def8",
  "wardrobe-1": "photo-1558997519-83ea9252def8",
  "wardrobe-2": "photo-1595526114035-0d45ed16cfbf",
  "wardrobe-3": "photo-1616486338812-3dadae4b4ace",
  "wardrobe-4": "photo-1616046229478-9901c5536a45",
  "wardrobe-5": "photo-1505693416388-ac5ce068fe85",
  "wardrobe-6": "photo-1600585154340-be6161a56a0c",

  // Living Room
  "living-hero": "photo-1600210492486-724fe5c67fb0",
  "living-1": "photo-1600210492486-724fe5c67fb0",
  "living-2": "photo-1618219908412-a29a1bb7b86e",
  "living-3": "photo-1600607687920-4e2a09cf159d",
  "living-4": "photo-1586023492125-27b2c045efd7",
  "living-5": "photo-1618221195710-dd6b41faaea6",
  "living-6": "photo-1600585154340-be6161a56a0c",

  // Bathroom
  "bathroom-hero": "photo-1584622650111-993a426fbf0a",
  "bathroom-1": "photo-1584622650111-993a426fbf0a",
  "bathroom-2": "photo-1552321554-5fefe8c9ef14",
  "bathroom-3": "photo-1620626011761-996317b8d101",
  "bathroom-4": "photo-1604014237800-1c9102c219da",
  "bathroom-5": "photo-1507652313519-d4e9174996dd",
  "bathroom-6": "photo-1540555700478-4be289fbecef",

  // Balcony
  "balcony-hero": "photo-1512917774080-9991f1c4c750",
  "balcony-1": "photo-1512917774080-9991f1c4c750",
  "balcony-2": "photo-1502672260266-1c1ef2d93688",
  "balcony-3": "photo-1586023492125-27b2c045efd7",
  "balcony-4": "photo-1560448204-e02f11c3d0e2",
  "balcony-5": "photo-1513694203232-719a280e022f",
  "balcony-6": "photo-1600585154340-be6161a56a0c",

  // Cafe
  "cafe-hero": "photo-1554118811-1e0d58224f24",
  "cafe-1": "photo-1554118811-1e0d58224f24",
  "cafe-2": "photo-1501339847302-ac426a4a7cbb",
  "cafe-3": "photo-1442512595331-e89e73853f31",
  "cafe-4": "photo-1559925393-8be0ec4767c8",
  "cafe-5": "photo-1517248135467-4c7edcad34c4",
  "cafe-6": "photo-1497366216548-37526070297c",

  // Salon
  "salon-hero": "photo-1560066984-138dadb4c035",
  "salon-1": "photo-1560066984-138dadb4c035",
  "salon-2": "photo-1521590832167-7bcbfaa6381f",
  "salon-3": "photo-1600948836101-f9ffda59d250",
  "salon-4": "photo-1522337360788-8b13dee7a37e",
  "salon-5": "photo-1562322140-8baeececf3df",
  "salon-6": "photo-1516975080664-ed2fc6a32937",

  // Office
  "office-hero": "photo-1497366216548-37526070297c",
  "office-1": "photo-1497366216548-37526070297c",
  "office-2": "photo-1497215728101-856f4ea42174",
  "office-3": "photo-1524758631624-e2822e304c36",
  "office-4": "photo-1504384308090-c894fdcc538d",
  "office-5": "photo-1517502884422-41eaead166d4",
  "office-6": "photo-1498050108023-c5249f4df085",

  // Hotel
  "hotel-hero": "photo-1582719478250-c89cae4dc85b",
  "hotel-1": "photo-1582719478250-c89cae4dc85b",
  "hotel-2": "photo-1566073771259-6a8506099945",
  "hotel-3": "photo-1590490360182-c33d57733427",
  "hotel-4": "photo-1578683010236-d716f9a3f461",
  "hotel-5": "photo-1591088398332-8a7791972843",
  "hotel-6": "photo-1520250497591-112f2f40a3f4",

  // School
  "school-hero": "photo-1580582932707-520aed937b7b",
  "school-1": "photo-1580582932707-520aed937b7b",
  "school-2": "photo-1509062522246-3755977927d7",
  "school-3": "photo-1524178232363-1fb2b075b655",
  "school-4": "photo-1577896851231-70ef18881754",
  "school-5": "photo-1497633762265-9d179a990aa6",
  "school-6": "photo-1503676260728-1c00da094a0b",

  // Hospital
  "hospital-hero": "photo-1519494026892-80bbd2d6fd0d",
  "hospital-1": "photo-1519494026892-80bbd2d6fd0d",
  "hospital-2": "photo-1586773860418-d37222d8fce3",
  "hospital-3": "photo-1538108149393-fbbd81895907",
  "hospital-4": "photo-1505751172876-fa1923c5c528",
  "hospital-5": "photo-1516549655169-df83a0774514",
  "hospital-6": "photo-1629909613654-28e377c37b09",

  // Gym
  "gym-hero": "photo-1534438327276-14e5300c3a48",
  "gym-1": "photo-1534438327276-14e5300c3a48",
  "gym-2": "photo-1540497077202-7c8a3999166f",
  "gym-3": "photo-1571902943202-507ec2618e8f",
  "gym-4": "photo-1574680096145-d05b474e2155",
  "gym-5": "photo-1584735935682-2f2b69dff9d2",
  "gym-6": "photo-1517838277536-f5f99be501cd",

  // Home Wallpaper
  "wallpaper-hero": "photo-1615529182904-14819c35db37",
  "wallpaper-1": "photo-1615529182904-14819c35db37",
  "wallpaper-2": "photo-1618221195710-dd6b41faaea6",
  "wallpaper-3": "photo-1600585154340-be6161a56a0c",
  "wallpaper-4": "photo-1513694203232-719a280e022f",
  "wallpaper-5": "photo-1586023492125-27b2c045efd7",
  "wallpaper-6": "photo-1616486338812-3dadae4b4ace",

  // Home Bar
  "bar-hero": "photo-1572116469696-31de0f17cc34",
  "bar-1": "photo-1572116469696-31de0f17cc34",
  "bar-2": "photo-1514933651103-005eec06c04b",
  "bar-3": "photo-1543007630-9710e4a00a20",
  "bar-4": "photo-1470337458703-46ad1756a187",
  "bar-5": "photo-1527061011665-3652c757a4d4",
  "bar-6": "photo-1574096079513-d8259312b785",

  // Pooja Room
  "pooja-hero": "photo-1600585154340-be6161a56a0c",
  "pooja-1": "photo-1600585154340-be6161a56a0c",
  "pooja-2": "photo-1513519245088-0e12902e5a38",
  "pooja-3": "photo-1507473885765-e6ed057f782c",
  "pooja-4": "photo-1616046229478-9901c5536a45",
  "pooja-5": "photo-1540518614846-7ede433c4b13",
  "pooja-6": "photo-1616486338812-3dadae4b4ace",

  // Space Saving
  "spacesaving-hero": "photo-1595526114035-0d45ed16cfbf",
  "spacesaving-1": "photo-1595526114035-0d45ed16cfbf",
  "spacesaving-2": "photo-1558997519-83ea9252def8",
  "spacesaving-3": "photo-1505693416388-ac5ce068fe85",
  "spacesaving-4": "photo-1616486338812-3dadae4b4ace",
  "spacesaving-5": "photo-1616046229478-9901c5536a45",
  "spacesaving-6": "photo-1600585154340-be6161a56a0c",

  // Staircase
  "staircase-hero": "photo-1513694203232-719a280e022f",
  "staircase-1": "photo-1513694203232-719a280e022f",
  "staircase-2": "photo-1600585154340-be6161a56a0c",
  "staircase-3": "photo-1600607687920-4e2a09cf159d",
  "staircase-4": "photo-1512917774080-9991f1c4c750",
  "staircase-5": "photo-1600210492486-724fe5c67fb0",
  "staircase-6": "photo-1502672260266-1c1ef2d93688",

  // Study Room
  "study-hero": "photo-1517502884422-41eaead166d4",
  "study-1": "photo-1517502884422-41eaead166d4",
  "study-2": "photo-1497366216548-37526070297c",
  "study-3": "photo-1497215728101-856f4ea42174",
  "study-4": "photo-1504384308090-c894fdcc538d",
  "study-5": "photo-1498050108023-c5249f4df085",
  "study-6": "photo-1524758631624-e2822e304c36",

  // TV Unit
  "tvunit-hero": "photo-1600210492486-724fe5c67fb0",
  "tvunit-1": "photo-1600210492486-724fe5c67fb0",
  "tvunit-2": "photo-1618219908412-a29a1bb7b86e",
  "tvunit-3": "photo-1618221195710-dd6b41faaea6",
  "tvunit-4": "photo-1586023492125-27b2c045efd7",
  "tvunit-5": "photo-1616486338812-3dadae4b4ace",
  "tvunit-6": "photo-1600585154340-be6161a56a0c",

  // Wall Decor
  "walldecor-hero": "photo-1513519245088-0e12902e5a38",
  "walldecor-1": "photo-1513519245088-0e12902e5a38",
  "walldecor-2": "photo-1615529182904-14819c35db37",
  "walldecor-3": "photo-1586023492125-27b2c045efd7",
  "walldecor-4": "photo-1618221195710-dd6b41faaea6",
  "walldecor-5": "photo-1616486338812-3dadae4b4ace",
  "walldecor-6": "photo-1600210492486-724fe5c67fb0",

  // Wall Paint
  "wallpaint-hero": "photo-1589834390005-5d4fb9bf3d32",
  "wallpaint-1": "photo-1589834390005-5d4fb9bf3d32",
  "wallpaint-2": "photo-1618219908412-a29a1bb7b86e",
  "wallpaint-3": "photo-1600585154340-be6161a56a0c",
  "wallpaint-4": "photo-1615529182904-14819c35db37",
  "wallpaint-5": "photo-1586023492125-27b2c045efd7",
  "wallpaint-6": "photo-1600210492486-724fe5c67fb0",

  // Window
  "window-hero": "photo-1502672260266-1c1ef2d93688",
  "window-1": "photo-1502672260266-1c1ef2d93688",
  "window-2": "photo-1513694203232-719a280e022f",
  "window-3": "photo-1600585154340-be6161a56a0c",
  "window-4": "photo-1512917774080-9991f1c4c750",
  "window-5": "photo-1600607687920-4e2a09cf159d",
  "window-6": "photo-1600210492486-724fe5c67fb0",

  // Tile
  "tile-hero": "photo-1600585152220-90363fe7e115",
  "tile-1": "photo-1600585152220-90363fe7e115",
  "tile-2": "photo-1584622650111-993a426fbf0a",
  "tile-3": "photo-1552321554-5fefe8c9ef14",
  "tile-4": "photo-1620626011761-996317b8d101",
  "tile-5": "photo-1604014237800-1c9102c219da",
  "tile-6": "photo-1507652313519-d4e9174996dd",

  // Front Elevation
  "elevation-hero": "photo-1600585154340-be6161a56a0c",
  "elevation-1": "photo-1600585154340-be6161a56a0c",
  "elevation-2": "photo-1600596542815-ffad4c1539a9",
  "elevation-3": "photo-1512917774080-9991f1c4c750",
  "elevation-4": "photo-1600607687920-4e2a09cf159d",
  "elevation-5": "photo-1600566753376-12c8ab7fb75b",
  "elevation-6": "photo-1600585154526-990dced4db0d",

  // Kitchen Interiors
  "kitcheninteriors-hero": "photo-1556911220-e15b29be8c8f",
  "kitcheninteriors-1": "photo-1556911220-e15b29be8c8f",
  "kitcheninteriors-2": "photo-1600585154526-990dced4db0d",
  "kitcheninteriors-3": "photo-1507089947368-19c1da9775ae",
  "kitcheninteriors-4": "photo-1600566753086-00f18fb6b3ea",
  "kitcheninteriors-5": "photo-1556909212-d5b604d0c90d",
  "kitcheninteriors-6": "photo-1556912998-c57cc6b63cd7",

  // Kids Bedroom
  "kids-hero": "photo-1505693416388-ac5ce068fe85",
  "kids-1": "photo-1505693416388-ac5ce068fe85",
  "kids-2": "photo-1595526114035-0d45ed16cfbf",
  "kids-3": "photo-1616594039964-ae9021a400a0",
  "kids-4": "photo-1560185127-6ed189bf02f4",
  "kids-5": "photo-1540518614846-7ede433c4b13",
  "kids-6": "photo-1598928506311-c55ded91a20c",

  // Foyer
  "foyer-hero": "photo-1618219908412-a29a1bb7b86e",
  "foyer-1": "photo-1618219908412-a29a1bb7b86e",
  "foyer-2": "photo-1600210492486-724fe5c67fb0",
  "foyer-3": "photo-1616486338812-3dadae4b4ace",
  "foyer-4": "photo-1513519245088-0e12902e5a38",
  "foyer-5": "photo-1586023492125-27b2c045efd7",
  "foyer-6": "photo-1600585154340-be6161a56a0c",

  // Dressing Room
  "dressing-hero": "photo-1558997519-83ea9252def8",
  "dressing-1": "photo-1558997519-83ea9252def8",
  "dressing-2": "photo-1595526114035-0d45ed16cfbf",
  "dressing-3": "photo-1616486338812-3dadae4b4ace",
  "dressing-4": "photo-1616046229478-9901c5536a45",
  "dressing-5": "photo-1505693416388-ac5ce068fe85",
  "dressing-6": "photo-1600585154340-be6161a56a0c",
};

async function downloadImage(key, unsplashId) {
  const filePath = path.join(targetDir, `${key}.jpg`);
  if (fs.existsSync(filePath) && fs.statSync(filePath).size > 1000) {
    return;
  }
  const url = `https://images.unsplash.com/${unsplashId}?auto=format&fit=crop&w=1200&q=80`;
  return new Promise((resolve) => {
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        https.get(res.headers.location, (redRes) => {
          const file = fs.createWriteStream(filePath);
          redRes.pipe(file);
          file.on("finish", () => {
            file.close();
            resolve();
          });
        }).on("error", () => resolve());
      } else if (res.statusCode === 200) {
        const file = fs.createWriteStream(filePath);
        res.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve();
        });
      } else {
        resolve();
      }
    }).on("error", () => resolve());
  });
}

async function run() {
  console.log("Downloading curated design idea images...");
  const entries = Object.entries(photoMap);
  for (let i = 0; i < entries.length; i += 8) {
    const batch = entries.slice(i, i + 8);
    await Promise.all(batch.map(([k, id]) => downloadImage(k, id)));
    console.log(`Progress: ${Math.min(i + 8, entries.length)}/${entries.length}`);
  }
  console.log("Download completed!");
}

run();
