import { stringify } from 'csv-stringify/sync';
import fs from 'fs';

export const writeCsv = (filename: string, rows: Record<string, unknown>[]): void => {
  if (!rows.length) {
    throw new Error('No rows to write!');
  }

  const outputText = stringify([
    Object.keys(rows[0]!),
    ...rows.map((row) => Object.values(row)),
  ]);

  fs.writeFileSync(filename, outputText);
};
