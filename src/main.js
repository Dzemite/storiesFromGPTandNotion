import { Telegraf } from "telegraf";
import { message } from "telegraf/filters";
import config from "config";
import { chatGPT } from "./chatgpt.js";
import { notionCreate } from "./notion.js";
import { Loader } from "./loader.js";

const bot = new Telegraf(config.get('TELEGRAM_TOKEN'), {
  handlerTimeout: Infinity,
});

bot.command('start', ctx => {
  ctx.reply('Добро пожаловать в бота. Отправте текстовое сообщение с тезисами про историю.');
})

bot.on(message('text'), async ctx => {
  try {
    const text = ctx.message.text;
    if (!text.trim()) return ctx.reply('Текст не может быть пустым.');

    const loader = new Loader(ctx);

    loader.show();

    const response = await chatGPT(text);
    if (!response) return ctx.reply('Ошибка с API', response);

    const notionResponse = await notionCreate(text, response.content);

    loader.hide();

    ctx.reply(`Ваша страница: ${notionResponse.url}`);
  } catch (e) {
      console.error('Error while processing text: ', e.message);
  }
});

bot.launch();
