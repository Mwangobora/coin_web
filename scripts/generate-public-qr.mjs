import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

import { QRCodeSVG } from "qrcode.react";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

const siteUrl =
  process.env.PUBLIC_CUSTOMER_SITE_URL ?? "https://coin-web-weld.vercel.app";
const qrToken =
  process.env.PUBLIC_CHARGING_QR_TOKEN ??
  "cmsqr_dVkGhCMkpUw2wAh5ZkSGHU_D5FbncfcQ";

const normalizedSiteUrl = siteUrl.replace(/\/$/, "");
const chargerTargetUrl = `${normalizedSiteUrl}/charge/${qrToken}`;
const websiteTargetUrl = `${normalizedSiteUrl}/`;
const outDir = path.join(process.cwd(), "public", "qr");

function createQrSvg(targetUrl, title) {
  return renderToStaticMarkup(
    React.createElement(QRCodeSVG, {
      value: targetUrl,
      size: 1024,
      level: "H",
      marginSize: 4,
      title,
    }),
  );
}

const qrFiles = [
  {
    targetUrl: chargerTargetUrl,
    title: "Charging machine QR code",
    svgPath: path.join(outDir, "charging-machine-001.svg"),
    txtPath: path.join(outDir, "charging-machine-001-url.txt"),
  },
  {
    targetUrl: websiteTargetUrl,
    title: "Charging website QR code",
    svgPath: path.join(outDir, "coin-web-home.svg"),
    txtPath: path.join(outDir, "coin-web-home-url.txt"),
  },
];

await mkdir(outDir, { recursive: true });

for (const qrFile of qrFiles) {
  const svg = createQrSvg(qrFile.targetUrl, qrFile.title);

  await writeFile(qrFile.svgPath, `${svg}\n`);
  await writeFile(qrFile.txtPath, `${qrFile.targetUrl}\n`);

  console.log(`QR URL: ${qrFile.targetUrl}`);
  console.log(`QR SVG: ${qrFile.svgPath}`);
}
