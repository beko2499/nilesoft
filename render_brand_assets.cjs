const sharp = require("C:/Users/win 10/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp");
const path = require("node:path");

const root = __dirname;
const output = path.join(root, "brand-assets");

async function render() {
  await sharp(path.join(output, "nilesoft-qr.svg"), { density: 96, limitInputPixels: false })
    .resize(2400, 2400, { fit: "fill", kernel: "nearest" })
    .png({ compressionLevel: 9, palette: false })
    .withMetadata({ density: 600 })
    .toFile(path.join(output, "nilesoft-qr-2400.png"));

  await sharp(path.join(output, "nilesoft-business-card.svg"), { density: 96, limitInputPixels: false })
    .resize(3400, 2200, { fit: "fill" })
    .png({ compressionLevel: 9, palette: false })
    .withMetadata({ density: 600 })
    .toFile(path.join(output, "nilesoft-business-card-3400x2200.png"));

  await sharp(path.join(output, "nilesoft-business-card-3400x2200.png"))
    .resize(1700, 1100)
    .png({ compressionLevel: 9 })
    .toFile(path.join(output, "nilesoft-business-card-preview.png"));

  await sharp(path.join(output, "nilesoft-business-card-3400x2200.png"))
    .resize(1004, 650)
    .png({ compressionLevel: 9 })
    .withMetadata({ density: 300 })
    .toFile(path.join(output, "nilesoft-business-card-print-85x55mm-300dpi.png"));
}

render().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
