import { getChatGPTResponse } from './openai';

//Импортируем библиотеку для создания бота
import { Telegraf } from 'telegraf';

// Стартовое сообщения после сообщения /start
import { START_MESSAGE } from './config';
import dotenv from "dotenv";

dotenv.config();

//Создаем бота для телеграм
export const initTelegramBot = () => {

  //Создаем бота для телеграм используя его API
  const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || '');

  //Функция для отправки стартового сообщения
  bot.start((ctx) => ctx.reply(START_MESSAGE));

  //Функция для получения сообщения от пользователя и отправки сообщения от исскуственного интелекта
  bot.on('text', async (ctx: any) => {
    
    //Сообщение пользователя
    const userMessage = ctx.message.text;

    //Отправляем запрос с данным сообщением исскуственному интелекту
    const result = await getChatGPTResponse(userMessage)

    //Отправляем сообщение исскуственного интелекта обратно пользователю
    await ctx.reply(result);
  });

  //Запуск бота
  bot.launch()
};
