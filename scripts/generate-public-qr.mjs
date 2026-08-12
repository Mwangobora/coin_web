import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { QRCodeSVG } from "qrcode.react";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const siteUrl =
  process.env.PUBLIC_CUSTOMER_SITE_URL ??
  "https://charging-customer-web.vercel.app";
const qrToken =
  process.env.PUBLIC_CHARGING_QR_TOKEN ??
  "cmsqr_dVkGhCMkpUw2wAh5ZkSGHU_D5FbncfcQ";

const targetUrl = `${siteUrl.replace(/\/$/, "")}/charge/${qrToken}`;
const outDir = path.join(process.cwd(), "public", "qr");
const svgPath = path.join(outDir, "charging-machine-001.svg");
const txtPath = path.join(outDir, "charging-machine-001-url.txt");

const svg = renderToStaticMarkup(
  React.createElement(QRCodeSVG, {
    value: targetUrl,
    size: 1024,
    level: "H",
    marginSize: 4,
    title: "Charging machine QR code",
  }),
);

await mkdir(outDir, { recursive: true });
await writeFile(svgPath, `${svg}\n`);
await writeFile(txtPath, `${targetUrl}\n`);

console.log(`QR URL: ${targetUrl}`);
console.log(`QR SVG: ${svgPath}`);
