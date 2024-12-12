// Импорт библиотек на стороне сервера
import express from 'express'
import { Response, Request } from 'express'
import * as path from 'path'

// Импортируем телеграм бота
import { initTelegramBot } from './bot'
import { createServer } from 'http'
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

//Инициализация сервера
const app = express()
app.use(bodyParser.json());

const server = createServer(app)

//Инициализация бота телеграм
initTelegramBot()

app.use(express.static('public'))

//Путь до станадртной страницы сервера
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
})

// Порт на котором работает сервер
const PORT: string | number = process.env.PORT || 3000

// Запуск сервера
server.listen(PORT, () => {
  console.log(`server running at http://localhost:${PORT}`)
})