import SQLite from 'better-sqlite3';
import {
  Kysely, SqliteDialect, Selectable, Updateable,
} from 'kysely';

export interface Database {
  application: ApplicationTable
}

export interface ApplicationTable {
  'Record id': string,
  'Policy experience': string,
  'Career level': string,
  'Career level details': string,
  'Profession': string,
  'Field of study': string,
  'Organisation': string,
  'AI Safety Experience': string,
  'Career plans': string,
  'Most underrated risk': string,
  'Claimed interest in policy': string,
  'Most exciting project': string,
  'Technical experience (multiselect)': string,
  'Policy experience (multiselect)': string,
  'Anything else?': string,
  'Target: Policy expertise': number,
  'Target: Relative focus on extreme risk framing': number,
  'Target: Likelihood to work on AI governance': number,
  'Target: Profile promise': number,
  'Target: Excited to accept?': 'Yes' | 'Maybe' | 'No',
  'Generated: policy experience AI transcript': string | null,
  'Generated: AI pred 1': number | null,
  'Generated: AI pred 2': number | null,
  'Generated: AI pred 3': number | null,
  'Generated: AI pred 4': number | null,
  'Generated: AI pred 5': number | null,
  'Generated: policy experience AI prediction uncertainty': number | null,
  'Generated: Updated at': number | null,
}

export type Application = Selectable<ApplicationTable>;
export type ApplicationUpdate = Updateable<ApplicationTable>;

const dialect = new SqliteDialect({
  database: new SQLite('data.db'),
});

export const db = new Kysely<Database>({
  dialect,
});
