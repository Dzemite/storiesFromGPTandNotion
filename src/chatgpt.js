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

const getMessage = (m, story = true) => story
    ? `
      Напиши из этих тезисов последовательную и эмоциональную историю: ${m}

      Эти тезисы описывают ключивые моменты дня.
      Необходимо в итоге получить историю с эмоциями, чтобы я запомнил этот день и смог в последствии рассказывать её друзьям.
      Ограничься 200 словами, соблюдай последовательность и учитывай контекст.
    `
    : m;

export async function chatGPT(message = '', story = true) {
  const messages = [];
  if (story) {
    messages.push({
      role: ROLES.SYSTEM,
      content: 'Ты опытный копирайтер, который пишет краткие эмоциональные статьи для соц сетей.'
    });
  }
  
  messages.push({
    role: ROLES.USER,
    content: getMessage(message, story)
  });

  try {
    const completion = await openai.chat.completions.create({
      messages,
      model: CHAT_GPT_MODEL
    });

    return completion.choices[0].message;
  } catch (e) {
    console.error(`Error while chat completion: ${e.message}`);
  }
}
