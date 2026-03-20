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
const NEXT_DIR = path.join(ROOT, ".next");
const HOSTING = path.join(ROOT, ".amplify-hosting");
const COMPUTE = path.join(HOSTING, "compute", "default");
const STATIC = path.join(HOSTING, "static");

// Discover the standalone output directory.
// In monorepos, Next.js may nest under a subfolder.
const standaloneRoot = path.join(NEXT_DIR, "standalone");
const candidateNested = path.join(standaloneRoot, "leaderboard");
const STANDALONE = fs.existsSync(path.join(candidateNested, "server.js"))
  ? candidateNested
  : standaloneRoot;

console.log(`Standalone directory: ${STANDALONE}`);

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isSymbolicLink()) {
      // Turbopack creates symlinks in .next/node_modules/ — resolve and copy
      const realPath = fs.realpathSync(srcPath);
      const stat = fs.statSync(realPath);
      if (stat.isDirectory()) {
        copyDir(realPath, destPath);
      } else {
        fs.copyFileSync(realPath, destPath);
      }
    } else if (entry.isDirectory()) {
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

// ─── Compute directory (standalone server) ───
fs.mkdirSync(COMPUTE, { recursive: true });
copyDir(STANDALONE, COMPUTE);

// Copy .next/static into compute/.next/static (needed at runtime)
const nextStaticSrc = path.join(NEXT_DIR, "static");
const nextStaticDest = path.join(COMPUTE, ".next", "static");
if (fs.existsSync(nextStaticSrc)) {
  copyDir(nextStaticSrc, nextStaticDest);
}

// ─── Copy full .next into .amplify-hosting/.next ───
// Amplify's Next.js SSR adapter validates server trace files, manifests, and
// required-server-files.json at .amplify-hosting/.next/. Copy the entire
// .next directory so every expected artifact is present.
const hostingNextDir = path.join(HOSTING, ".next");
console.log("Copying .next directory to .amplify-hosting/.next ...");
copyDir(NEXT_DIR, hostingNextDir);
console.log("✓ Copied .next directory");

// ─── Static directory (CDN-served files) ───
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

// ─── Copy required-server-files.json to hosting root ───
// Amplify's validator looks for this file at the root of the build output
// directory, not inside .next/.
const requiredSrc = path.join(NEXT_DIR, "required-server-files.json");
if (fs.existsSync(requiredSrc)) {
  fs.copyFileSync(requiredSrc, path.join(HOSTING, "required-server-files.json"));
  console.log("✓ Copied required-server-files.json to hosting root");
}

// ─── deploy-manifest.json ───
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
      runtime: "nodejs22.x",
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
console.log(`  - .next: ${fs.readdirSync(hostingNextDir).length} items`);
