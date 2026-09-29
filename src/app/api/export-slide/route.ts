import { NextRequest, NextResponse } from "next/server";
import puppeteer, { Browser } from "puppeteer-core";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";
export const maxDuration = 10; // Vercel Free Plan max duration is 10s

interface ExportSlideRequestBody {
  slideId: number;
  title?: string;
  html: string;
  styles?: string;
}

/**
 * Detects local Chrome / Edge executable for dev environments (Windows & macOS).
 */
function getLocalBrowserExecutablePath(): string | null {
  // Explicit env var
  if (process.env.PUPPETEER_EXECUTABLE_PATH && fs.existsSync(process.env.PUPPETEER_EXECUTABLE_PATH)) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }
  if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }

  // Windows
  if (process.platform === "win32") {
    const localAppData = process.env.LOCALAPPDATA || "C:\\Users\\Default\\AppData\\Local";
    const programFiles = process.env.ProgramFiles || "C:\\Program Files";
    const programFilesX86 = process.env["ProgramFiles(x86)"] || "C:\\Program Files (x86)";

    const candidates = [
      path.join(programFiles, "Google\\Chrome\\Application\\chrome.exe"),
      path.join(programFilesX86, "Google\\Chrome\\Application\\chrome.exe"),
      path.join(localAppData, "Google\\Chrome\\Application\\chrome.exe"),
      path.join(programFiles, "Microsoft\\Edge\\Application\\msedge.exe"),
      path.join(programFilesX86, "Microsoft\\Edge\\Application\\msedge.exe"),
      path.join(localAppData, "Microsoft\\Edge\\Application\\msedge.exe"),
    ];

    for (const candidate of candidates) {
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    }
  }

  // macOS
  if (process.platform === "darwin") {
    const candidates = [
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      "/Applications/Chromium.app/Contents/MacOS/Chromium",
      "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    ];
    for (const candidate of candidates) {
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    }
  }

  // Linux desktop / CI container with Chrome installed
  if (process.platform === "linux") {
    const candidates = [
      "/usr/bin/google-chrome-stable",
      "/usr/bin/google-chrome",
      "/usr/bin/chromium",
      "/usr/bin/chromium-browser",
      "/snap/bin/chromium",
    ];
    for (const candidate of candidates) {
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    }
  }

  return null;
}

/**
 * Launch Chromium either via local executable (in Dev) or via @sparticuz/chromium (in Vercel production).
 */
async function launchChromium(): Promise<Browser> {
  const localExecutable = getLocalBrowserExecutablePath();

  if (localExecutable) {
    return puppeteer.launch({
      executablePath: localExecutable,
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--font-render-hinting=none",
        "--hide-scrollbars",
      ],
    });
  }

  // Serverless Linux (Vercel Serverless Function)
  const chromium = (await import("@sparticuz/chromium")).default;
  const executablePath = await chromium.executablePath();

  return puppeteer.launch({
    args: [
      ...chromium.args,
      "--font-render-hinting=none",
      "--hide-scrollbars",
      "--disable-gpu",
    ],
    defaultViewport: {
      width: 1280,
      height: 720,
      deviceScaleFactor: 2,
    },
    executablePath,
    headless: true,
  });
}

/**
 * Inlines local public static images into Base64 data URLs to guarantee 0-latency offline rendering.
 */
function inlinePublicImages(html: string): string {
  const publicDir = path.join(process.cwd(), "public");

  return html.replace(/src=["'](\/[^"']+)["']/g, (match, relPath) => {
    try {
      // Remove query string if any
      const cleanRel = relPath.split("?")[0];
      const filePath = path.join(publicDir, cleanRel.startsWith("/") ? cleanRel.slice(1) : cleanRel);

      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        const mime =
          ext === ".png" ? "image/png" :
          ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" :
          ext === ".svg" ? "image/svg+xml" :
          ext === ".webp" ? "image/webp" : "application/octet-stream";

        const base64 = fs.readFileSync(filePath).toString("base64");
        return `src="data:${mime};base64,${base64}"`;
      }
    } catch {
      // Keep original src if file reading fails
    }
    return match;
  });
}

export async function POST(req: NextRequest) {
  let browser: Browser | null = null;

  try {
    const body = (await req.json()) as ExportSlideRequestBody;
    const { html, styles = "" } = body;

    if (!html || typeof html !== "string") {
      return NextResponse.json({ error: "Parameter html slide tidak ditemukan." }, { status: 400 });
    }

    // Replace all local public images with base64 data URLs
    const inlinedHtml = inlinePublicImages(html);

    const fullDocumentHtml = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=1280, initial-scale=1.0">
  <style>
    *, *::before, *::after {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      box-sizing: border-box;
    }
    html, body {
      margin: 0;
      padding: 0;
      background-color: #ffffff;
      overflow: hidden;
      width: 1280px;
      height: 720px;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
  </style>
  ${styles}
</head>
<body>
  ${inlinedHtml}
</body>
</html>`;

    browser = await launchChromium();
    const page = await browser.newPage();

    // Set viewport: 1280x720 with deviceScaleFactor: 2 for Retina 2K resolution (2560x1440)
    await page.setViewport({
      width: 1280,
      height: 720,
      deviceScaleFactor: 2,
    });

    await page.setContent(fullDocumentHtml, {
      waitUntil: ["domcontentloaded", "load"],
      timeout: 8000,
    });

    // Small delay to ensure any chart animations or layout paints complete
    await new Promise((resolve) => setTimeout(resolve, 120));

    const screenshot = await page.screenshot({
      type: "jpeg",
      quality: 92,
      clip: {
        x: 0,
        y: 0,
        width: 1280,
        height: 720,
      },
    });

    await page.close().catch(() => {});
    await browser.close().catch(() => {});
    browser = null;

    return new NextResponse(screenshot as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg",
        "Content-Length": screenshot.length.toString(),
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error: any) {
    console.error("Export slide error:", error);
    if (browser) {
      await browser.close().catch(() => {});
    }
    return NextResponse.json(
      { error: error?.message || "Gagal memproses slide." },
      { status: 500 }
    );
  }
}
