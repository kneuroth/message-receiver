import * as fs from 'fs';
import * as path from 'path';

const PNG_DIR = 'src/constants/templates/icons';
const OUTPUT_FILE = 'src/constants/png-icons.ts';

function toConstantName(filename: string): string {
  // big-smile.png -> BIG_SMILE_PNG
  return filename
    .replace('.png', '')
    .toUpperCase()
    .replace(/-/g, '_') + '_PNG';
}

function generatePngIconsFile(): void {
  if (!fs.existsSync(PNG_DIR)) {
    console.log(`Directory not found: ${PNG_DIR}`);
    return;
  }

  const pngFiles = fs.readdirSync(PNG_DIR).filter((f) => f.endsWith('.png'));

  if (pngFiles.length === 0) {
    console.log(`No .png files found in ${PNG_DIR}`);
    return;
  }

  const exports: string[] = [];

  pngFiles.forEach((filename) => {
    const filePath = path.join(PNG_DIR, filename);
    const buffer = fs.readFileSync(filePath);
    const base64 = buffer.toString('base64');
    const dataUrl = `data:image/png;base64,${base64}`;

    const constName = toConstantName(filename);
    const altText = filename.replace('.png', '').replace(/-/g, ' ');

    // Expects square PNGs, renders at 32x32
    const imgTag = `<img src="${dataUrl}" alt="${altText}" width="32" height="32" loading="lazy" decoding="async">`;

    exports.push(`export const ${constName} = \`${imgTag}\`;`);
  });

  const tsContent = `// AUTO-GENERATED from PNG files in ${PNG_DIR} - DO NOT EDIT DIRECTLY
// Run 'npm run build' to regenerate

${exports.join('\n\n')}
`;

  fs.writeFileSync(OUTPUT_FILE, tsContent);
  console.log(`Generated: ${OUTPUT_FILE} with ${pngFiles.length} icons`);
}

generatePngIconsFile();
console.log('PNG icons build complete!');
