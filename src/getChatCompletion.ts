import axios from 'axios';
import pLimit from 'p-limit';
import { openAiRequestConcurrency, openAiApiKey, openAiModel } from './config';

export type Prompt = { role: 'system' | 'user' | 'assistant' | 'function', content: string }[];

const globalRateLimit = pLimit(openAiRequestConcurrency);

export async function getChatCompletion(
  messages: Prompt,
): Promise<string> {
  return globalRateLimit(async () => {
    const response = await axios({
      method: 'POST',
      url: 'https://api.openai.com/v1/chat/completions',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openAiApiKey}`,
      },
      data: {
        model: openAiModel,
        messages,
        max_tokens: 500,
      },
    });
    return response.data.choices[0].message.content;
  });
}
