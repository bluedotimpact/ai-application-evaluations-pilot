This product is archived. This means we no longer use or develop it.

You might want to see [ai-evaluator-extension](https://github.com/bluedotimpact/ai-evaluator-extension) instead. It was created after this pilot given this pilot's success.

---

# ai-applications-evaluations-pilot

We previously manually evaluated each applicant for our educational courses on a set of objective criteria. We would then use these scores plus some additional subjective judgement to come to an application decision. This is time-intensive, and it's difficult to align all the humans to give the same responses for the same person.

This is a pilot project to test the feasibility of using [LLMs](https://en.wikipedia.org/wiki/Large_language_model) to just do the initial scoring part. We were largely interested in seeing whether we could get the scores the LLM gave to be aligned with what the humans rated applicants.

Specifically, this software takes applicants in [`data.csv`](./data.csv) (which fallsback to [`demo.csv`](./demo.csv)) and evaluates them against a criteria defined in [`config.ts`](./src/config.ts) using the [GPT-3.5 Turbo API](https://platform.openai.com/docs/models/gpt-3-5-turbo). It then outputs these results to [`output.csv`](./output.csv).

After considering [the privacy implications](#privacy), we tested this against a range of pseudonymised prior course applications and found a range of [results](#results). Ultimately we concluded that LLMs, while not perfect, could help us automate our application process.

## Usage

1. Install Git and Node.js
2. Clone this repo
3. Run `npm install` to install dependencies
4. Run `OPENAI_API_KEY=sk-abcd npm start`

## Privacy

This is a data protection impact assessment (DPIA) based on the [ICO's template](https://ico.org.uk/media/for-organisations/documents/2553993/dpia-template.docx).

We will only use AI services as GDPR processors, and not share the data with them as controllers (e.g. we will NOT opt-in to allowing OpenAI to use the data to train future models)

Aims, summary of processing, and need for a DPIA: The project aims to provide a proof of concept as to whether AI systems might be able to partially automate the application evaluation process, in particular for categorisation questions based on clear objective criteria. We are completing the DPIA to decide whether to go ahead with the pilot, and if so whether it’s appropriate to use real data.

Nature of processing: We will be crafting a prompt (e.g. with a categorisation question and clear criteria for how to categorise people), then injecting the personal data (such as a description of someone’s experience they used to apply to the governance course with), and then asking an AI LLM to answer the question. We will do this across the application data we have, and then try to answer ‘is this close to human accuracy’ (e.g. by comparing the distance between LLM-ratings and human ratings) and ‘what ways can we get more accurate results from the LLMs’ (e.g. by tweaking the prompt and reviewing results).

Scope of processing: The source of the application data will be applications to our AI governance course, and evaluations performed by BlueDot Impact staff on those applications. We will remove obvious identifiers or data that is irrelevant to answering the questions (e.g. don’t need to know their name, email, gender, ethnic background). For some people, this will effectively pseudonymise the data (but it is still personal data!), and for others it will go some way to reducing risks but will not perfectly scrub identifiers (e.g. if their free-text answer to the prompt includes information about their role on a specific project, it might be possible to reidentify them). This processing is part of a one-off pilot project expected to last less than a week, and the results from this pilot are solely to evaluate system feasiability - not to make decisions about the applicants (who have already been accepted/rejected based on human evaluations)

Context of processing: The data subjects are: the members of the public who applied to the course, AND the BlueDot Impact staff who gave evaluations as part of their jobs. We expect it is reasonable to review application data to improve our future systems, as it is set out in our privacy notice. Additionally anecdotally some people asked us if we were using AI to make evaluation decisions (appearing to be out of curiosity rather than concern), and seemed surprised that we did it manually: suggesting using AI on application data is the way people were expecting us to use their data. All BlueDot Impact staff have been informed about the pilot are seem keen for it to go ahead. No prior concerns have been identified on any other tasks we perform with data which seem relevant here. This is somewhat novel by its nature of being a pilot project, and uses new technologies like artificial intelligence.

Purpose of processing: To evaluate the feasibility of using AI systems to help evaluate applications more efficiently (primarily thinking of a model of human decision making augmented by AI: for example AI to categorise people with tags like ‘Undergrad’ or ‘Experienced professional’, or to rank people on predefined scales like ‘No familiarity with ML’ to ‘Lots of familiarity with ML’). This is part of the wider purpose in our privacy policy ‘to use data analytics to improve our website, services, online forums or sites, marketing efforts, and user experience’, which feeds into our legitimate interest in wanting ‘to improve our programs’, ultimately ‘to best serve our charitable aims in the most efficient manner possible’. The benefits to individuals will be that in future they will receive a decision back on their application more quickly, these decisions will be more standardised and thus fairer, and that we will be able to surface more relevant information about their application to a human decision maker so that application decisions are better informed.

Consultation: We have consulted the data subjects who are BlueDot Impact staff members, who seem positive about the project. We have discussed the plans with some of the applicants whose data will be used in this way, and they have seemed excited about the systems being improved. The person running the pilot project has appropriate experience with data protection and cybersecurity, and is the information security expert in the organisation.

Compliance measures: Lawful basis is legitimate interest. We strongly believe the processing is necessary and proportionate to achieve the purpose and outcomes, and there is no strong alternative (one alternative considered is to use mock data, but this would be less realistic and create significant burden to create + evaluate manually). We believe being a time bound pilot project (and strictly time bound given the person running it is leaving the organisation on secondment soon), function creep is unlikely. We have taken steps to minimize data used e.g. by stripping identifiers and irrelevant personal data. We are not explicitly reaching out to individuals to inform them of this processing given we expect it to have very low risks to the rights and freedoms of those individuals, and given our existing consultation with stakeholders to not be surprising.

Risk 1: Information security breach, leading to harms to individuals (e.g. most likely that they lay out their career plans and are negatively treated because of this). Likelihood: Remote (given partial pseudonymisation, strong technical and organisational measures, appropriately trained and risk-aware staff), Severity: significant (given risk of detriment to employment), Overall risk: Low (given low likelihood)

Risk 2: Individuals are concerned by use of AI models evaluating them, and are upset that they believe they were not adequately informed. Likelihood: Possible (lower: privacy notice, experiences consulting some of the individuals, higher: audience are people potentially concerned about AI systems), Severity: Minimal (given actual damages are small, and can confidently explain to them what we were doing), Overall risk: Low.

No medium or high risks identified.

Decision: We will proceed with pilot project (not full rollout until later review!) with the appropriate safeguards as above.

Signed off on: 2023-08-17

## Results

- This definitely seems feasible as a thing we could use: with some tweaking of the prompt, the AI seems calibrated to our evaluation criteria on the question of ‘policy experience’ to +/- 1 point 75% of the time (+/- 2 points 90%). In the cases it is off, it usually isn’t wildly off and it’s usually unclear to humans what the reasonable rating should be. As such, we think the AI performance (when tuned) is near enough to humans to warrant exploring using this on courses further.
- It takes quite some carefully tweaking of the criteria to truly be objective, clear and accurate. It appears that manually evaluating about ~20 applications, then using these to work on and test the AI prompt. Spot checking applications to ensure the system is working as expected feels like a broadly good idea too.
- As we discovered when doing human evaluations, clearer application questions that were more closely tied to what the evaluation criteria were would significantly reduce uncertainty about certain responses.
- The rate limits on OpenAI’s API do restrict how fast you can get evaluations through (e.g. about 2 per second with GPT-3.5: for a course of 1000 participants that’s 8 minutes).
  - Later update: OpenAI increased their API limits, plus introduced a tiered system where if you pay for more credit these limits are increased.
- Asking for a range (e.g. min and max rating) did not seem to help:
    - the range was not wider when the model was further from the human judgement
    - often when the model was very far away, the range did not include the human value
- Asking for an uncertainty rating (e.g. how uncertain on a scale 0-3) does not help:
    - R^2 between uncertainty rating and actual diff = 0.05
- Asking for a uncertainty boolean does not help (much):
    - +/- 1 accuracy where it was confident: 72%
    - +/- 1 accuracy where it was not confident: 68%
- Asking multiple times:
    - Overall reliability
        - Appears fairly consistent - average std deviation 0.7
    - Does the AI changing its mind appear to indicate it's more likely to be wrong?
        - No
    - Does the AI not changing its mind correlate to indication of accuracy?
        - No
- Not tested (due to lack of API access): is using GPT-4 or Claude 2 better?
  - Later update: We got access to GPT-4, and it is quite a bit better particularly for more complex rubrics. Claude 2 was much worse than even GPT-3.5 for this task, although we didn't optimise the prompt too hard here.
- Not tested: are open-source models just as capable (could be faster + cheaper + lower risk of data loss)
  - Later update: We tested this out with Llama 2 and the accuracy was much worse. It was also quite a pain to get set up, particularly compared to the ease of using an existing API. Potentially fine-tuning might improve accuracy, but we didn't explore this.

## Contributing

Pull requests are welcomed on GitHub! To get started:

1. Install Git and Node.js
2. Clone the repository
3. Install dependencies with `npm install`
4. Run `npm run test` to run tests
5. Build with `npm run build`
