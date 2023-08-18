import { parse } from 'csv-parse';
import { createReadStream } from 'node:fs';

export const readCsv = async (filename: string): Promise<Record<string, unknown>[]> => {
  const rows: Record<string, unknown>[] = [];
  return new Promise((resolve, reject) => {
    createReadStream(filename)
      .on('error', (error) => {
        reject(new Error('💥 Error reading CSV', { cause: error }));
      })
      .pipe(parse({ columns: true }))
      .on('data', async (row) => {
        rows.push(row);
      })
      .on('end', () => {
        resolve(rows);
      });
  });
};
