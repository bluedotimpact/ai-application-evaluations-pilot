import pRetry from 'p-retry';
import { Prompt, getChatCompletion } from './getChatCompletion';
import {
  applicationsDataCsvFilename, outputCsvFilename, outputWithTranscriptsCsvFilename, predictionPrompts,
} from './config';
import { readCsv } from './readCsv';
import { writeCsv } from './writeCsv';

// TODO: test if plain JSON is better
const stringifyApplicationForLLM = (application: object) => {
  return Object.entries(application)
    .filter(([key, value]) => key !== 'Record id' && value)
    .map(([key, value]) => `### ${key}\n\n${value}`)
    .join('\n\n');
};

// TODO: test if returning response in JSON is better
const extractFinalRanking = (text: string, rankingKeyword = 'FINAL_RANKING'): number => {
  const regex = new RegExp(`${rankingKeyword}\\s*=\\s*(\\d+)`);
  const match = text.match(regex);

  if (match && match[1]) {
    return parseInt(match[1]);
  }

  throw new Error(`Missing final ranking (${rankingKeyword})`);
};

type Application = {
  'Record id': string,
  [key: string]: unknown,
};

const processApplicationPrediction = async (application: Application, promptText: string): Promise<{ transcript: string, ranking: number }> => {
  const fullPrompt: Prompt = [
    { role: 'user', content: stringifyApplicationForLLM(application) },
    { role: 'system', content: promptText },
  ];
  const completion = await getChatCompletion(fullPrompt);
  const transcript = [...fullPrompt, { role: 'assistant', content: completion }]
    .map((message) => `## ${message.role}\n\n${message.content}`)
    .join('\n\n');
  const ranking = extractFinalRanking(completion);
  return { transcript, ranking };
};

// Retry-wrapper around processApplicationPrediction
// Common failure reasons:
// - the model doesn't follow instructions to output the ranking in the requested format
// - the model waffles on too long and hits the token limit
// - we hit OpenAI rate limits, or just transient faults
// Retrying (with exponential backoff) appears to fix these problems
const retryingProcessApplicationPrediction = (application: Application, promptKey: string, promptText: string) => pRetry(
  async () => processApplicationPrediction(application, promptText),
  { onFailedAttempt: (error) => console.error(`😥 Failed processing record ${application['Record id']} on attempt ${error.attemptNumber} for prompt '${promptKey}': `, error) },
);

const processApplication = async (application: Application) => {
  // In parallel, we process each prediction prompt for this application
  // Example output: { "[e] Policy experience": { "ranking": 7, "transcript": "### user ..." }  }
  const results = Object.fromEntries(await Promise.all(
    Object.entries(predictionPrompts)
      .map((async ([promptKey, promptText]) => [promptKey, await retryingProcessApplicationPrediction(application, promptKey, promptText)] as const)),
  ));

  console.log(`✅ Extracted data for record ${application['Record id']}`);

  return {
    Application: application['Record id'],
    ...results,
  } as { Application: string } & typeof results;
};

(async () => {
  console.log(`👀 Reading ${applicationsDataCsvFilename}...`);
  const applications = await readCsv(applicationsDataCsvFilename) as Application[];
  if (applications.some((a) => !a['Record id'])) {
    throw new Error('Applications are missing a \'Record id\'');
  }

  console.log(`👤 Processing ${applications.length} applicant(s)...`);
  const results = await Promise.all(applications.map(processApplication));

  console.log(`💾 Saving key output to ${outputCsvFilename}...`);
  writeCsv(outputCsvFilename, results.map((r) => ({
    ...(Object.fromEntries(Object.entries(r).flatMap(([key, value]) => (typeof value === 'object' ? [
      [key, value.ranking],
    ] : [])))),
    Application: r.Application,
  })));

  console.log(`💾 Saving full debugging output to ${outputWithTranscriptsCsvFilename}...`);
  writeCsv(outputWithTranscriptsCsvFilename, results.map((r) => ({
    ...(Object.fromEntries(Object.entries(r).flatMap(([key, value]) => (typeof value === 'object' ? [
      [`${key}_ranking`, value.ranking],
      [`${key}_transcript`, value.transcript],
    ] : [])))),
    Application: r.Application,
  })));

  console.log('🎉 All complete');
})();
