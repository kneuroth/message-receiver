import fs from 'fs/promises';
import path from 'path';

function hashContent(s: string) {
  return s.split("").reduce(function (a: number, b: string) {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
}

export async function createHTMLFile(content: string): Promise<string> {
  const hash = hashContent(content);
  const tempPath = path.join(__dirname, 'temp', `temp-${hash}.html`);
  await fs.mkdir(path.dirname(tempPath), { recursive: true });
  await fs.writeFile(tempPath, content, 'utf-8');
  return tempPath;
}