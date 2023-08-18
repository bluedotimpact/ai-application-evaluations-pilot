// This was written as a one-off to import the CSV into SQLite

// import { parse } from 'csv-parse';
// import { createReadStream } from 'node:fs';
// import { db } from './db';

// await db.schema.createTable('application')
//   .addColumn('Record id', 'text', (cb) => cb.primaryKey().notNull())
//   .addColumn('Policy experience', 'text')
//   .addColumn('Career level', 'text')
//   .addColumn('Career level details', 'text')
//   .addColumn('Profession', 'text')
//   .addColumn('Field of study', 'text')
//   .addColumn('Organisation', 'text')
//   .addColumn('AI Safety Experience', 'text')
//   .addColumn('Career plans', 'text')
//   .addColumn('Most underrated risk', 'text')
//   .addColumn('Claimed interest in policy', 'text')
//   .addColumn('Most exciting project', 'text')
//   .addColumn('Technical experience (multiselect)', 'text')
//   .addColumn('Policy experience (multiselect)', 'text')
//   .addColumn('Anything else?', 'text')
//   .addColumn('Target: Policy expertise', 'integer')
//   .addColumn('Target: Relative focus on extreme risk framing', 'integer')
//   .addColumn('Target: Likelihood to work on AI governance', 'integer')
//   .addColumn('Target: Profile promise', 'integer')
//   .addColumn('Target: Excited to accept?', 'text')
//   .addColumn('Generated: policy experience AI transcript', 'text')
//   .addColumn('Generated: policy experience AI prediction', 'integer')
//   .addColumn('Generated: policy experience AI prediction min', 'integer')
//   .addColumn('Generated: policy experience AI prediction max', 'integer')
//   .execute();

// createReadStream('data.csv')
//   .on('error', (error) => {
//     console.error('💥 Error reading CSV: ', error);
//   })
//   .pipe(parse({ columns: true }))
//   .on('data', async (row) => {
//     try {
//       const res = await db.insertInto('application').values(row).execute();
//       console.log(res);
//     } catch (error) {
//       console.error(`😥 Failed processing record ${row['Record id']}: `, error);
//     }
//   })
//   .on('end', () => {
//     console.log('🎉 Processing complete');
//   });
