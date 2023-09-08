import { Markup } from "telegraf";
import { BaseScene } from "telegraf/scenes";
import { message } from "telegraf/filters";
import { chatGPT } from "../chatgpt.js";
import { Loader } from "../loader.js";

const clearChatScene = new BaseScene('clearChatScene');
clearChatScene.enter(async (ctx, next) => {
  await ctx.reply(
    'Привет, в этой комнате вы можете посылать сообщения ChatGPT. Чтобы выйти из комнаты нажмите `Вернуться`.',
    Markup.inlineKeyboard([
      Markup.button.callback('Вернуться', 'leave'),
    ])
  );
  await next();
});

clearChatScene.on(message('text'), async ctx => {
  try {
    const text = ctx.message.text;
    if (!text.trim()) return ctx.reply('Текст не может быть пустым.');

    const loader = new Loader(ctx);

    loader.show();

    const response = await chatGPT(text, false);
    if (!response) return ctx.reply('Ошибка с API', response);

    loader.hide();

    ctx.reply(response.content);
  } catch (e) {
      console.error('Error while processing text: ', e.message);
  }
});

clearChatScene.leave( async (ctx, next) => {
  await ctx.reply('Прощайте');
  await next();
});

clearChatScene.hears('Вернуться', async (ctx, next) => {
  await ctx.scene.leave();
  await next();
});

clearChatScene.action('leave', async (ctx, next) => {
  await ctx.scene.leave();
  await next();
});

export default clearChatScene;
