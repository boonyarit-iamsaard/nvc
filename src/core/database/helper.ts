import { existsSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import type { z } from 'zod';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function readFromFile(fileName: string): string | undefined {
  console.info(`[SEEDER] 📄 reading file: ${fileName}`);

  const path = join(__dirname, 'data', fileName);
  if (!existsSync(path)) {
    console.warn(`[SEEDER] 🚫 file not found: ${path}`);

    return;
  }

  return readFileSync(path, 'utf-8');
}

export function parseData<T>(fileName: string, schema: z.ZodType<T>) {
  const rawData = readFromFile(fileName);
  if (!rawData) {
    return;
  }

  console.info(`[SEEDER] 🔍 parsing data from ${fileName}`);

  const jsonData: unknown = JSON.parse(rawData);
  if (Array.isArray(jsonData)) {
    const parsedArray = jsonData.map((item) => schema.safeParse(item));
    const errors = parsedArray.filter((result) => !result.success);
    if (errors.length > 0) {
      console.warn(
        `[SEEDER] 🚫 invalid data in ${fileName}:`,
        JSON.stringify(errors.map((error) => error.error)),
      );

      return;
    }

    return parsedArray.map((result) => result.data);
  } else {
    const parsedData = schema.safeParse(jsonData);
    if (!parsedData.success) {
      console.warn(
        `[SEEDER] 🚫 invalid data in ${fileName}:`,
        JSON.stringify(parsedData.error),
      );

      return;
    }

    return parsedData.data;
  }
}
