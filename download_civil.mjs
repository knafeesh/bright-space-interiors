import https from "https";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dest = path.join(__dirname, "public", "images", "specialty-civil.jpg");
const url = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=80";

function download(targetUrl, targetDest) {
  const file = fs.createWriteStream(targetDest);
  https.get(targetUrl, (res) => {
    if (res.statusCode >= 300 && res.headers.location) {
      return download(res.headers.location, targetDest);
    }
    res.pipe(file);
    file.on("finish", () => {
      file.close(() => console.log("✓ specialty-civil.jpg downloaded"));
    });
  }).on("error", (err) => {
    fs.unlinkSync(targetDest);
    console.error(err);
  });
}

download(url, dest);
