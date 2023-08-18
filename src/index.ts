import pLimit from 'p-limit';
// import { sql } from 'kysely';
import { sql } from 'kysely';
import { Prompt, getChatCompletion } from './getChatCompletion';
import { Application, db } from './db';

const POLICY_EXPERIENCE_PROMPT = `Paying special attention to the 'Policy experience' answer, rank this applicant on a scale from 1 to 10 following this rubric:
1 - No policy experience.
2 - Informed. Some understanding of policy, has maybe read a few blog articles or subscribes to a couple of relevant newsletters.
3 - Some studies. Has studied a short course, or read multiple relevant books.
5 - Formally studied. Policy / governance / politics / international relations / similar is a main area of study at university level or equivalent, or perhaps they've participated an amateur think-tank report, e.g. via a short internship. Perhaps was involved in youth politics.
7 - Work in policy. Is currently working full time in policy or strategic research (that doesn't necessarily need to be AI policy directly yet), but is still quite junior. Has certainly contributed and has leverage, but is not yet a leader. Alternatively, they may have a credible role in private sector working that meaningfully shapes the direction of AI governance within a private sector organization.
10 - Experienced policy professional. Has worked in policy and appears to have led on a policy win in a serious institution close to - or in - government.

Clarification: You should interpolate between values e.g. for 4, 6, 8, 9. By policy, we mean in the context of policymaking, especially in government or regulators (but we should still somewhat appreciate corporate governance, e.g. if that could set a policy in a big tech org regarding use of AI). You should ignore general statements about policy, and focus on what policy work they have actually done. You should also ignore statements about compliance with policies (e.g. GDPR): we care about writing new policy. You might consider how leveragable their current role is (for example, if they are already in a key policymaking role they should be rated higher). You should also somewhat consider general writing ability here (dock points for poorly-written applications).

Explain your reasoning for the rating, and why you are or aren't certain of it. Then afterwards output your final answer by stating 'FINAL_RANKING = ' and then the relevant integer between 1 and 10.`;

// TODO: test if plain JSON is better
const stringifyApplicationForLLM = (application: object) => {
  const filteredObject = Object.entries(application)
    .filter(([key, value]) => key !== 'Record id' && !key.startsWith('Target: ') && !key.startsWith('Generated: ') && !key.includes('multiselect') && value)
    .reduce<Record<string, unknown>>((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {});

  return Object.entries(filteredObject)
    .map(([key, value]) => `### ${key}\n\n${value}`)
    .join('\n\n');
};

const extractFinalRanking = (text: string, rankingType: string): number => {
  const regex = new RegExp(`${rankingType}\\s*=\\s*(\\d+)`);
  const match = text.match(regex);

  if (match && match[1]) {
    return parseInt(match[1]);
  }

  throw new Error(`Missing final ranking (${rankingType})`);
};

const extractFinalRankings = (text: string) => {
  return {
    main: extractFinalRanking(text, 'FINAL_RANKING'),
  };
};

const processApplication = async (application: Application) => {
  const prompt: Prompt = [
    { role: 'user', content: stringifyApplicationForLLM(application) },
    { role: 'system', content: POLICY_EXPERIENCE_PROMPT },
  ];
  const completions = (await getChatCompletion(prompt)).filter((completion) => {
    try {
      extractFinalRankings(completion);
      return true;
    } catch (error) {
      return false;
    }
  }).slice(0, 5);

  if (completions.length < 5) {
    throw new Error('not enough satisfactory completions');
  }

  await db.updateTable('application').where('Record id', '==', application['Record id']).set({
    'Generated: policy experience AI transcript':
      [...prompt, { role: 'assistant', content: completions[0] }]
        .map((message) => `## ${message.role}\n\n${message.content}`)
        .join('\n\n'),
    'Generated: AI pred 1': null,
    'Generated: AI pred 2': null,
    'Generated: AI pred 3': null,
    'Generated: AI pred 4': null,
    'Generated: AI pred 5': null,
    'Generated: Updated at': Date.now(),
  }).execute();

  completions.forEach(async (completion, i) => {
    try {
      const aiRankings = extractFinalRankings(completion);
      await db.updateTable('application').where('Record id', '==', application['Record id']).set({
        [`Generated: AI pred ${i + 1}`]: aiRankings.main,
        'Generated: Updated at': Date.now(),
      }).execute();
    } catch (error) {
      console.error(`😥 Failed processing record ${application['Record id']} at attempt ${i}: `, error);
    }
  });
};

(async () => {
  const applications = await db.selectFrom('application').selectAll()
    // .where('Generated: AI pred 1', 'is', null)
    // .where('Record id', '==', 'recFU1TCcFNX6LJsc')
    // .where('Record id', '<=', 'recG1kIHKIdg6Pzke')
    // .where(sql`abs("Target: Policy expertise" - "Generated: AI pred 1")`, '>=', 3)
    // .where('Generated: Updated at', '<', 1692306692238)
    .where('Generated: AI pred 5', 'is', null)
    .orderBy(sql`random()`)
    .limit(200)
    .execute();
  console.log(`👤 Found ${applications.length} applicant(s)`);

  const rateLimit = pLimit(1);

  await Promise.all(applications.map((application) => rateLimit(async () => {
    try {
      await processApplication(application);
      // console.log(`✅ Extracted data for record ${application['Record id']}: human ${application['Target: Policy expertise']}/10, AI ${aiRanking.main}/10 (uncertainty: ${aiRanking.uncertainty}), diff: ${aiRanking.main - application['Target: Policy expertise']}`);
      console.log(`✅ Extracted data for record ${application['Record id']}`);
    } catch (error) {
      console.error(`😥 Failed processing record ${application['Record id']}: `, error);
    }
  })));

  console.log('🎉 Process complete');
})();
