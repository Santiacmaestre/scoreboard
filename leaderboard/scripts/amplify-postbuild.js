#!/usr/bin/env node

/**
 * Post-build script that creates the .amplify-hosting directory structure
 * required by AWS Amplify WEB_COMPUTE platform.
 *
 * Expects `next build` with `output: "standalone"` to have run first.
 */

const fs = require("fs");
const path = require("path");

const ROOT = process.cwd();
const STANDALONE = path.join(ROOT, ".next", "standalone", "leaderboard");
const HOSTING = path.join(ROOT, ".amplify-hosting");
const COMPUTE = path.join(HOSTING, "compute", "default");
const STATIC = path.join(HOSTING, "static");

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// Clean previous output
if (fs.existsSync(HOSTING)) {
  fs.rmSync(HOSTING, { recursive: true });
}

// Create compute directory with standalone server
fs.mkdirSync(COMPUTE, { recursive: true });
copyDir(STANDALONE, COMPUTE);

// Copy .next/static into compute/.next/static (needed at runtime)
const nextStaticSrc = path.join(ROOT, ".next", "static");
const nextStaticDest = path.join(COMPUTE, ".next", "static");
if (fs.existsSync(nextStaticSrc)) {
  copyDir(nextStaticSrc, nextStaticDest);
}

// Create static directory with public files and _next/static
fs.mkdirSync(STATIC, { recursive: true });

// Copy public/ files to static/
const publicDir = path.join(ROOT, "public");
if (fs.existsSync(publicDir)) {
  copyDir(publicDir, STATIC);
}

// Copy .next/static to static/_next/static
const staticNextDest = path.join(STATIC, "_next", "static");
if (fs.existsSync(nextStaticSrc)) {
  copyDir(nextStaticSrc, staticNextDest);
}

// Write deploy-manifest.json
const manifest = {
  version: 1,
  routes: [
    {
      path: "/_next/static/*",
      target: { kind: "Static" },
    },
    {
      path: "/*.*",
      target: { kind: "Static" },
      fallback: { kind: "Compute", src: "default" },
    },
    {
      path: "/*",
      target: { kind: "Compute", src: "default" },
    },
  ],
  computeResources: [
    {
      name: "default",
      entrypoint: "server.js",
      runtime: "nodejs18.x",
    },
  ],
  framework: {
    name: "next",
    version: "16.2.0",
  },
};

fs.writeFileSync(
  path.join(HOSTING, "deploy-manifest.json"),
  JSON.stringify(manifest, null, 2)
);

console.log("✓ .amplify-hosting directory created successfully");
console.log(`  - compute/default: ${fs.readdirSync(COMPUTE).length} items`);
console.log(`  - static: ${fs.readdirSync(STATIC).length} items`);
