import { cpSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const output = join(root, ".deploy");
const files = [
    "404.html",
    "_redirects",
    "admin.css",
    "admin.html",
    "admin.js",
    "checkout.html",
    "confirmation.html",
    "data.js",
    "firebase-config.js",
    "hero-bg.png",
    "index.html",
    "logo.png",
    "script.js",
    "seed-data.js",
    "style.css"
];

rmSync(output, { recursive: true, force: true });
mkdirSync(output, { recursive: true });
files.forEach((file) => cpSync(join(root, file), join(output, file)));
cpSync(join(root, "products"), join(output, "products"), { recursive: true });
