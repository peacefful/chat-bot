import { getChatGPTResponse } from "./utils/openai";
import fs from "fs";
import { createExcelFile } from "./utils/createExelFile";

//Импортируем библиотеку для создания бота
import { Telegraf } from "telegraf";

// Стартовое сообщения после сообщения /start
import { START_MESSAGE } from "./config/config";
import dotenv from "dotenv";

dotenv.config();

//Создаем бота для телеграм
export const initTelegramBot = () => {
  //Создаем бота для телеграм используя его API
  const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || "");

  //Функция для отправки стартового сообщения
  bot.start((ctx) => ctx.reply(START_MESSAGE));

  //Функция для получения сообщения от пользователя и отправки сообщения от исскуственного интелекта
  bot.on("text", async (ctx: any) => {
    console.log("Получено сообщение от пользователя:", ctx.message);

    //Сообщение пользователя
    const userMessage = ctx.message.text;

    //Отправляем запрос с данным сообщением исскуственному интелекту
    const result = await getChatGPTResponse(userMessage);

    //Отправляем сообщение исскуственного интелекта обратно пользователю
    await ctx.reply(result);

    await ctx.replyWithDocument({
      source: "./files/a42f4ace-b913-4f90-ba63-98250dd0c281_gold_statement.pdf",
    });
  });

  bot.command("excel", async (ctx) => {
    const filePath = await createExcelFile();

    await ctx.replyWithDocument({
      source: fs.createReadStream(filePath),
      filename: "generated_file.xlsx",
    });
  });

  //Запуск бота
  bot.launch();
};
