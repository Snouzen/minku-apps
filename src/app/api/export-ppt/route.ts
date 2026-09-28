import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer-core";
import pptxgen from "pptxgenjs";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";
export const maxDuration = 120; // Allow up to 2 minutes for processing multiple high-resolution slides

interface SlidePayload {
  id: number;
  title: string;
  html: string;
}

interface ExportPptRequestBody {
  slides: SlidePayload[];
  styles?: string;
  origin?: string;
}

/**
 * Detects the Chromium or Google Chrome/Edge executable path across various environments.
 */
function getBrowserExecutablePath(): string {
  // 1. Check explicit environment variables
  if (process.env.PUPPETEER_EXECUTABLE_PATH && fs.existsSync(process.env.PUPPETEER_EXECUTABLE_PATH)) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }
  if (process.env.CHROME_PATH && fs.existsSync(process.env.CHROME_PATH)) {
    return process.env.CHROME_PATH;
  }

  // 2. Windows paths (Chrome & Edge)
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

  // 3. Linux / Docker container paths
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

  // 4. macOS paths
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

  throw new Error(
    "Browser Chromium/Chrome tidak ditemukan di server. Pastikan Google Chrome atau Microsoft Edge terpasang."
  );
}

export async function POST(req: NextRequest) {
  let browser: any = null;

  try {
    const body = (await req.json()) as ExportPptRequestBody;
    const { slides, styles = "", origin = "" } = body;

    if (!slides || !Array.isArray(slides) || slides.length === 0) {
      return NextResponse.json(
        { error: "Tidak ada slide yang dipilih untuk diekspor." },
        { status: 400 }
      );
    }

    const executablePath = getBrowserExecutablePath();

    // Launch Chromium instance
    browser = await puppeteer.launch({
      executablePath,
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-extensions",
        "--font-render-hinting=none",
        "--hide-scrollbars",
      ],
    });

    const page = await browser.newPage();

    // Set viewport: 1280x720 with deviceScaleFactor: 2 for ultra-crisp 2560x1440 retina output
    await page.setViewport({
      width: 1280,
      height: 720,
      deviceScaleFactor: 2,
    });

    // Intercept local assets from public/ folder for instant offline rendering
    const publicDir = path.join(process.cwd(), "public");
    await page.setRequestInterception(true);

    page.on("request", (interceptedReq: any) => {
      try {
        const reqUrl = interceptedReq.url();
        const parsed = new URL(reqUrl);
        const pathname = decodeURIComponent(parsed.pathname);
        const diskFile = path.join(publicDir, pathname);

        if (fs.existsSync(diskFile) && fs.statSync(diskFile).isFile()) {
          const ext = path.extname(diskFile).toLowerCase();
          const mimeType =
            ext === ".png"
              ? "image/png"
              : ext === ".jpg" || ext === ".jpeg"
              ? "image/jpeg"
              : ext === ".svg"
              ? "image/svg+xml"
              : ext === ".webp"
              ? "image/webp"
              : "application/octet-stream";

          const fileData = fs.readFileSync(diskFile);
          interceptedReq.respond({
            status: 200,
            contentType: mimeType,
            body: fileData,
          });
          return;
        }
      } catch {
        // Continue normally on any error
      }
      interceptedReq.continue();
    });

    // Initialize PPTX presentation with 16:9 layout
    const ppt = new pptxgen();
    ppt.layout = "LAYOUT_16x9";

    // Process each slide sequentially
    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];

      const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=1280, initial-scale=1">
  ${origin ? `<base href="${origin}/">` : ""}
  ${styles}
  <style>
    *, *::before, *::after {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      box-sizing: border-box;
    }
    html, body {
      margin: 0 !important;
      padding: 0 !important;
      width: 1280px !important;
      height: 720px !important;
      overflow: hidden !important;
      background-color: #ffffff !important;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
  </style>
</head>
<body>
  ${slide.html}
</body>
</html>`;

      await page.setContent(fullHtml, { waitUntil: "load", timeout: 15000 });

      // Ensure fonts and vector graphics are settled
      try {
        await page.evaluate(() => (document as any).fonts?.ready);
      } catch {
        // Non-critical if fonts.ready fails
      }
      await new Promise((r) => setTimeout(r, 60));

      // Capture screenshot at scale factor 2 (2560x1440 resolution)
      const screenshot = await page.screenshot({
        type: "png",
        omitBackground: false,
      });

      // Add to PPT presentation
      const pptSlide = ppt.addSlide();
      pptSlide.addImage({
        data: `image/png;base64,${Buffer.from(screenshot).toString("base64")}`,
        x: 0,
        y: 0,
        w: "100%",
        h: "100%",
      });
    }

    // Close browser as soon as capturing finishes
    await browser.close();
    browser = null;

    // Generate PPTX binary buffer
    const pptBuffer = (await ppt.write({ outputType: "nodebuffer" })) as Buffer;

    const todayStr = new Date().toISOString().split("T")[0];
    const fileName = `Laporan_Harian_ERP_${todayStr}.pptx`;

    return new Response(new Uint8Array(pptBuffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error: any) {
    console.error("PPT Export Error:", error);
    if (browser) {
      try {
        await browser.close();
      } catch {
        // Ignore close error on cleanup
      }
    }
    return NextResponse.json(
      { error: error?.message || "Terjadi kesalahan saat memproses ekspor PPT." },
      { status: 500 }
    );
  }
}
