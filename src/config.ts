import 'dotenv/config';

// Export this from Airtable
// It should only include a 'Record id' column, and then columns with the features you want to use to do the predictions (e.g. answers to application questions). Do not include personal data where it is not relevant to the decision (e.g. no need for name, email, ethnic background, gender)
export const applicationsDataCsvFilename = 'data.csv';

// This is where you'll copy and paste from back into the evaluations table in Airtable
export const outputCsvFilename = 'output.csv';

// This is useful for debugging why the model has made certain decisions
export const outputWithTranscriptsCsvFilename = 'outputWithTranscripts.csv';

// These define what things you want the model to predict. They will be done independently. You should make sure they encourage the AI model outputting an integer after 'FINAL_RANKING = '.
export const predictionPrompts = {
  '[e] Policy experience': `Paying special attention to the 'Policy experience' answer, rank this applicant on a scale from 1 to 10 following this rubric:
1 - No policy experience.
2 - Informed. Some understanding of policy, has maybe read a few blog articles or subscribes to a couple of relevant newsletters.
3 - Some studies. Has studied a short course, or read multiple relevant books.
5 - Formally studied. Policy / governance / politics / international relations / similar is a main area of study at university level or equivalent, or perhaps they've participated an amateur think-tank report, e.g. via a short internship. Perhaps was involved in youth politics.
7 - Work in policy. Is currently working full time in policy or strategic research (that doesn't necessarily need to be AI policy directly yet), but is still quite junior. Has certainly contributed and has leverage, but is not yet a leader. Alternatively, they may have a credible role in private sector working that meaningfully shapes the direction of AI governance within a private sector organization.
10 - Experienced policy professional. Has worked in policy and appears to have led on a policy win in a serious institution close to - or in - government.

Clarification: You should interpolate between values e.g. for 4, 6, 8, 9. By policy, we mean in the context of policymaking, especially in government or regulators (but we should still somewhat appreciate corporate governance, e.g. if that could set a policy in a big tech org regarding use of AI). You should ignore general statements about policy, and focus on what policy work they have actually done. You should also ignore statements about compliance with policies (e.g. GDPR): we care about writing new policy. You might consider how leveragable their current role is (for example, if they are already in a key policymaking role they should be rated higher). You should also somewhat consider general writing ability here (dock points for poorly-written applications).

Explain your reasoning for the rating. Then afterwards output your final answer by stating 'FINAL_RANKING = ' and then the relevant integer between 1 and 10.`,
  '[e] AIS familiarity': `Rank this applicant's relative focus on the extreme risk framing (e.g. with AI takeover and risks from advanced AI) on a scale from 1 to 5 following this rubric:
1 - Would likely bounce off of extreme risk framings, for example is dismissive about extreme risk or overfocuses on data quality / common biases.
2 - Not mentioned extreme risk but seems neutral about it.
3 - Perhaps mentioned they are concerned about extreme risk, but not their main priority or are particularly lightly about it.
4 - Has discussed their concerns about extreme risk, but they've either not thought about it a lot before, or it's one priority amongst many mentioned.
5 - Totally on board with extreme risk framing, it seems like they've thought about it reasonably deeply, and it's their main priority (or is simply the only type of risk mentioned).

Clarification: Indicators that this person has read up on the alignment problem / effective altruism (EA) / 80,000 Hours / global catastrophic risks indicates they are more comfortable with the extreme risk framing, but is not required.

Explain your reasoning for the rating. Then afterwards output your final answer by stating 'FINAL_RANKING = ' and then the relevant integer between 1 and 5.`,
};

export const openAiApiKey = process.env['OPENAI_API_KEY'];
// OpenAI model to use, in the format accepted by the OpenAI API: https://platform.openai.com/docs/models/model-endpoint-compatibility
export const openAiModel = 'gpt-3.5-turbo';
// Maximum number of open requests to OpenAI at any one time. Higher = faster, but more likely to hit OpenAI rate limits. From trial and error, between 1 and 5 seems about right.
export const openAiRequestConcurrency = 3;
