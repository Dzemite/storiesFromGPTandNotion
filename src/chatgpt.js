import OpenAI from "openai";
import config from "config";

const CHAT_GPT_MODEL = 'gpt-3.5-turbo';
const ROLES = {
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
  USER: 'user'
}

const openai = new OpenAI({
  apiKey: config.get('OPENAI_KEY'),
});

const getMessage = (m) => `
  Напиши из этих тезисов последовательную и эмоциональную историю: ${m}

  Эти тезисы описывают ключивые моменты дня.
  Необходимо в итоге получить историю с эмоциями, чтобы я запомнил этот день и смог в последствии рассказывать её друзьям.
  Ограничься 200 словами, соблюдай последовательность и учитывай контекст.
`;

export async function chatGPT(message = '') {
  const messages = [
    {
      role: ROLES.SYSTEM,
      content: 'Ты опытный копирайтер, который пишет краткие эмоциональные статьи для соц сетей.'
    },
    {
      role: ROLES.USER,
      content: getMessage(message)
    }
  ];

  try {
    const completion = await openai.chat.completions.create({
      messages,
      model: CHAT_GPT_MODEL
    });

    console.log(completion.choices[0].message);

    return completion.choices[0].message;
  } catch (e) {
    console.error(`Error while chat completion: ${e.message}`);
  }
}
