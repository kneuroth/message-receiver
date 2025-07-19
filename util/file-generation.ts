import fs from 'fs/promises';
import path from 'path';

export async function createHTMLFile(content: string): Promise<string> {
  const tempPath = path.join(__dirname, 'temp', `temp-${Date.now()}.html`);
  await fs.mkdir(path.dirname(tempPath), { recursive: true });
  await fs.writeFile(tempPath, content, 'utf-8');
  return tempPath;
}