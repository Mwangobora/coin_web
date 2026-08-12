import { readFile } from "node:fs/promises";
import path from "node:path";

import { chromium } from "@playwright/test";

const outDir = path.join(process.cwd(), "public", "qr");
const qrSvgPath = path.join(outDir, "charging-machine-001.svg");
const qrUrlPath = path.join(outDir, "charging-machine-001-url.txt");
const pdfPath = path.join(outDir, "charging-machine-001-print.pdf");

const [qrSvg, qrUrl] = await Promise.all([
  readFile(qrSvgPath, "utf8"),
  readFile(qrUrlPath, "utf8"),
]);

const cleanUrl = qrUrl.trim();
const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Smart Charging QR</title>
    <style>
      @page {
        size: A4;
        margin: 18mm;
      }

      * {
        box-sizing: border-box;
      }

      body {
        margin: 0;
        color: #111827;
        font-family:
          Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
          "Segoe UI", sans-serif;
        background: #ffffff;
      }

      .sheet {
        min-height: calc(297mm - 36mm);
        border: 2px solid #111827;
        border-radius: 18px;
        padding: 24px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        text-align: center;
      }

      .eyebrow {
        color: #f97316;
        font-size: 15px;
        font-weight: 800;
        letter-spacing: 0;
        margin: 0 0 8px;
      }

      h1 {
        margin: 0;
        font-size: 38px;
        line-height: 1.08;
        font-weight: 900;
      }

      .subtitle {
        margin: 14px 0 24px;
        max-width: 420px;
        color: #475569;
        font-size: 18px;
        line-height: 1.5;
        font-weight: 600;
      }

      .qr {
        width: 320px;
        height: 320px;
        padding: 14px;
        border: 1px solid #cbd5e1;
        border-radius: 20px;
      }

      .qr svg {
        width: 100%;
        height: 100%;
        display: block;
      }

      .price {
        margin: 22px 0 8px;
        display: flex;
        gap: 10px;
        font-size: 18px;
        font-weight: 900;
      }

      .pill {
        border-radius: 999px;
        background: #fff7ed;
        border: 1px solid #fed7aa;
        color: #9a3412;
        padding: 8px 16px;
      }

      .url {
        margin-top: 16px;
        max-width: 520px;
        overflow-wrap: anywhere;
        color: #64748b;
        font-size: 11px;
        line-height: 1.45;
      }
    </style>
  </head>
  <body>
    <main class="sheet">
      <p class="eyebrow">Smart Charging System</p>
      <h1>Scan to charge your phone</h1>
      <p class="subtitle">
        Fungua kamera, scan QR code, chagua muda wa kuchaji, kisha lipa.
      </p>
      <div class="qr">${qrSvg}</div>
      <div class="price">
        <span class="pill">TZS 200</span>
        <span class="pill">TZS 500</span>
      </div>
      <p class="url">${cleanUrl}</p>
    </main>
  </body>
</html>`;

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.setContent(html, { waitUntil: "networkidle" });
await page.pdf({
  path: pdfPath,
  format: "A4",
  printBackground: true,
  preferCSSPageSize: true,
});
await browser.close();

console.log(`QR PDF: ${pdfPath}`);
