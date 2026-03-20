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
const HOSTING = path.join(ROOT, ".amplify-hosting");
const COMPUTE = path.join(HOSTING, "compute", "default");
const STATIC = path.join(HOSTING, "static");

// Discover the standalone output directory.
// When appRoot is set, Next.js outputs directly to .next/standalone/.
// In monorepos without appRoot it may nest under a subfolder.
const standaloneRoot = path.join(ROOT, ".next", "standalone");
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

// Ensure required-server-files.json exists (Amplify deployment expects it).
// Next.js 16 standalone may not generate this file, so create a minimal one.
const requiredServerFilesSrc = path.join(ROOT, ".next", "required-server-files.json");
const requiredServerFilesDest = path.join(COMPUTE, ".next", "required-server-files.json");
if (fs.existsSync(requiredServerFilesSrc)) {
  fs.mkdirSync(path.dirname(requiredServerFilesDest), { recursive: true });
  fs.copyFileSync(requiredServerFilesSrc, requiredServerFilesDest);
  console.log("✓ Copied required-server-files.json");
} else {
  // Generate a minimal required-server-files.json so Amplify doesn't fail
  const minimal = {
    version: 1,
    config: {
      env: {},
      webpack: null,
      eslint: { ignoreDuringBuilds: false },
      typescript: { ignoreBuildErrors: false },
      distDir: ".next",
      cleanDistDir: true,
      assetPrefix: "",
      cacheMaxMemorySize: 52428800,
      configOrigin: "next.config.ts",
      useFileSystemPublicRoutes: true,
      generateEtags: true,
      pageExtensions: ["tsx", "ts", "jsx", "js"],
      poweredByHeader: true,
      compress: true,
      images: { deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], path: "/_next/image", loader: "default", domains: [], formats: ["image/webp"], minimumCacheTTL: 60 },
      devIndicators: {},
      onDemandEntries: { maxInactiveAge: 60000, pagesBufferLength: 5 },
      amp: { canonicalBase: "" },
      basePath: "",
      sassOptions: {},
      trailingSlash: false,
      i18n: null,
      productionBrowserSourceMaps: false,
      reactStrictMode: true,
      httpAgentOptions: { keepAlive: true },
      output: "standalone",
      modularizeImports: {},
      experimental: {},
    },
    appDir: ROOT,
    files: [],
    ignore: [],
  };
  fs.mkdirSync(path.dirname(requiredServerFilesDest), { recursive: true });
  fs.writeFileSync(requiredServerFilesDest, JSON.stringify(minimal, null, 2));
  console.log("✓ Generated required-server-files.json (Next.js 16 compat)");
}

// Copy to multiple locations where Amplify might look
const extraLocations = [
  path.join(HOSTING, ".next", "required-server-files.json"),
  path.join(HOSTING, "required-server-files.json"),
];
for (const loc of extraLocations) {
  fs.mkdirSync(path.dirname(loc), { recursive: true });
  fs.copyFileSync(requiredServerFilesDest, loc);
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
