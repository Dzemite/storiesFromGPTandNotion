import { Telegraf, session } from "telegraf";
import { Stage } from "telegraf/scenes";
import config from "config";
import clearChatScene from "./scenes/clearChatScene.js";
import storytellerScene from "./scenes/storytellerScene.js";
import { Markup } from "telegraf";
import { message } from "telegraf/filters";

const bot = new Telegraf(config.get('TELEGRAM_TOKEN'), {
  handlerTimeout: Infinity,
});
const stage = new Stage([clearChatScene, storytellerScene])
bot.use(session());
bot.use(stage.middleware());

bot.command('start', ctx => {
  ctx.reply(
    'Добро пожаловать в бота. Выберете что вы хотети, пообщаться с чатом или попросить составить историю по тезисам?',
    Markup.inlineKeyboard([
      Markup.button.callback('ChatGPT', 'chatGpt'),
      Markup.button.callback('Истории', 'storyteller'),
    ])
  );
})

bot.on(message('text'), async ctx => {
  ctx.reply(
    'Выберете что вы хотети, пообщаться с чатом или попросить составить историю по тезисам?',
    Markup.inlineKeyboard([
      Markup.button.callback('ChatGPT', 'chatGpt'),
      Markup.button.callback('Истории', 'storyteller'),
    ])
  );
});

bot.action('chatGpt', async (ctx, next) => {
  await ctx.scene.enter('clearChatScene');
  await next();
});

bot.action('storyteller', async (ctx, next) => {
  await ctx.scene.enter('storytellerScene');
  await next();
});

bot.launch();
