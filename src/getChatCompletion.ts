import axios from 'axios';

export type Prompt = { role: 'system' | 'user' | 'assistant' | 'function', content: string }[];

export async function getChatCompletion(
  messages: Prompt,
): Promise<string[]> {
  const response = await axios({
    method: 'POST',
    url: 'https://api.openai.com/v1/chat/completions',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env['OPENAI_API_KEY']}`,
    },
    data: {
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: 500,
      n: 7,
    },
  });
  return response.data.choices.map((choice: any) => choice.message.content);
}
