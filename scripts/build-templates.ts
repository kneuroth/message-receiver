import * as fs from 'fs';
import * as path from 'path';

const TEMPLATE_DIRS = [
  'src/constants/templates/scoreboards',
  'src/constants/templates/podiums',
];

function toConstantName(filename: string): string {
  return (
    filename.replace('.hbs', '').toUpperCase().replace(/-/g, '_') + '_TEMPLATE'
  );
}

function generateTsFile(hbsPath: string): void {
  const content = fs.readFileSync(hbsPath, 'utf-8');
  const filename = path.basename(hbsPath);
  const constName = toConstantName(filename);
  const tsPath = hbsPath.replace('.hbs', '.ts');

  const escaped = content
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$');

  const tsContent = `// AUTO-GENERATED from ${filename} - DO NOT EDIT DIRECTLY
// Run 'npm run build:templates' to regenerate

export const ${constName} = \`${escaped}\`;
`;

  fs.writeFileSync(tsPath, tsContent);
  console.log(`Generated: ${tsPath}`);
}

TEMPLATE_DIRS.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    console.log(`Directory not found: ${dir}`);
    return;
  }

  const hbsFiles = fs.readdirSync(dir).filter((f) => f.endsWith('.hbs'));

  if (hbsFiles.length === 0) {
    console.log(`No .hbs files found in ${dir}`);
    return;
  }

  hbsFiles.forEach((f) => generateTsFile(path.join(dir, f)));
});

console.log('Template build complete!');
