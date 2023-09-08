import { Markup } from "telegraf";
import { BaseScene } from "telegraf/scenes";
import { message } from "telegraf/filters";
import { chatGPT } from "../chatgpt.js";
import { Loader } from "../loader.js";
import { notionCreate } from "../notion.js";

const storytellerScene = new BaseScene('storytellerScene');
storytellerScene.enter(async (ctx, next) => {
  await ctx.reply(
    'Привет, в этой комнате вы можете писать тезисы по которым потом будет составлена история. Чтобы выйти из комнаты нажмите `Вернуться`.',
    Markup.inlineKeyboard([
      Markup.button.callback('Вернуться', 'leave'),
    ])
  );
  await next();
});

storytellerScene.on(message('text'), async ctx => {
  try {
    const text = ctx.message.text;
    if (!text.trim()) return ctx.reply('Текст не может быть пустым.');

    const loader = new Loader(ctx);

    loader.show();

    const response = await chatGPT(text);
    if (!response) return ctx.reply('Ошибка с API', response);

    const notionResponse = await notionCreate(text, response.content);

    loader.hide();

    ctx.reply(`${response.content} \n\nВаша страница: ${notionResponse.url}`);
  } catch (e) {
      console.error('Error while processing text: ', e.message);
  }
});

storytellerScene.leave( async (ctx, next) => {
  await ctx.reply('Прощайте');
  await next();
});

storytellerScene.hears('Вернуться', async (ctx, next) => {
  await ctx.scene.leave();
  await next();
});

storytellerScene.action('leave', async (ctx, next) => {
  await ctx.scene.leave();
  await next();
});

export default storytellerScene;
