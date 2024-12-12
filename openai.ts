import OpenAI from "openai"; // Импорт библиотеки OpenAI для работы с их API.
import dotenv from "dotenv"; // Импорт библиотеки dotenv для работы с переменными окружения.
import { BASE_SYSTEM_PROMPT } from "./config"; // Импорт переменной BASE_SYSTEM_PROMPT из локального файла config.ts.

dotenv.config(); 
// Загружает переменные окружения из файла .env в process.env.
// Это позволяет безопасно хранить такие данные, как ключи API, в файле .env.

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
  // Создаётся экземпляр OpenAI с использованием API-ключа, который хранится в переменных окружения.
  // process.env.OPENAI_API_KEY должен быть определён в вашем .env файле.
});

export const getChatGPTResponse = async (message: string): Promise<string> => {
  // Экспортируется асинхронная функция, которая принимает строку (сообщение) и возвращает строку.
  try {
    const response = await openai.chat.completions.create({
      // Вызов метода создания чата (chat.completions.create) для взаимодействия с GPT-4 через OpenAI API.
      model: "gpt-4o-mini", 
      // Указывается модель, которая будет использоваться. Здесь указана "gpt-4o-mini" (упрощённая версия GPT-4).
      
      messages: [
        { role: 'system', content: BASE_SYSTEM_PROMPT }, 
        // Первое сообщение задаёт "системную" инструкцию. BASE_SYSTEM_PROMPT — предварительно заданный контекст, определённый в config.ts.
        
        { role: "user", content: message } 
        // Второе сообщение содержит текст, введённый пользователем (аргумент message).
      ],

      max_tokens: 250, 
      // Ограничение на количество токенов (слов и символов), которые модель может сгенерировать в ответе.
    });

    console.log(response.choices[0].message);
    // Логирует первый ответ, сгенерированный моделью, для отладки.

    return response.choices[0]?.message.content || "Ошибка: пустой ответ.";
    // Возвращает содержимое ответа, если оно есть. Если ответа нет (или пусто), возвращает сообщение об ошибке.
  } catch (error) {
    console.error("Ошибка при вызове OpenAI API:", error);
    // Логирует ошибку в консоль, если произошёл сбой при вызове API.

    return "Извините, произошла ошибка при обработке запроса.";
    // Возвращает сообщение об ошибке, которое будет показано пользователю.
  }
};
