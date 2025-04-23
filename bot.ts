import { getChatGPTResponse } from "./utils/openai";
import fs from "fs";
import { updateOrCreateUserInExcel } from "./utils/createExelFile";

//Импортируем библиотеку для создания бота
import { Telegraf } from "telegraf";

// Стартовое сообщения после сообщения /start
import { START_MESSAGE } from "./config/config";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

//Создаем бота для телеграм
export const initTelegramBot = () => {
  //Создаем бота для телеграм используя его API
  const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN || "");

  //Функция для отправки стартового сообщения
  bot.start((ctx) => ctx.reply(START_MESSAGE));

  bot.command("excel", async (ctx) => {
    const filePath = path.join("files", "generated_file.xlsx");

    if (!fs.existsSync(filePath)) {
      return ctx.reply(
        "Файл Excel еще не создан. Сначала отправьте любое сообщение, чтобы он появился."
      );
    }

    await ctx.replyWithDocument({
      source: fs.createReadStream(filePath),
      filename: "generated_file.xlsx",
    });
  });

  //Функция для получения сообщения от пользователя и отправки сообщения от исскуственного интелекта
  bot.on("text", async (ctx: any) => {
    //Сообщение пользователя
    const userMessage = ctx.message.text;

    if (userMessage.startsWith("/")) return;

    const user = ctx.message.from;

    const userData = {
      id: user.id,
      name: `${user.first_name} ${user.last_name || ""}`.trim(),
      login: user.username || `user_${user.id}`,
      time: new Date().toLocaleString(),
    };

    await updateOrCreateUserInExcel(userData);

    //Отправляем запрос с данным сообщением исскуственному интелекту
    const result = await getChatGPTResponse(userMessage);

    //Отправляем сообщение исскуственного интелекта обратно пользователю
    await ctx.reply(result);
  });

  //Запуск бота
  bot.launch();
};
