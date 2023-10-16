import express from 'express'

import body_parser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'

import type { SequelizeOptions } from 'sequelize-typescript'
import DBConnection from './classes/dbConnection'
import AdminModels from './models/admin/index'

import admin_route from './routes/v1/admin/auth'
import answer_route from './routes/v1/quiz/answer'
import code_route from './routes/v1/translation/user'
import file_route from './routes/v1/file'
import quiz_route from './routes/v1/quiz/quiz'
import question_route from './routes/v1/quiz/question'
import presentation_route from './routes/v1/presentation'
import settings_route from './routes/v1/translation/settings'
import tab_route from './routes/v1/translation/tab'
import user_auth_route from './routes/v1/user/auth'
import vote_route from './routes/v1/vote'

dotenv.config()

const app = express()
const port = Number(process.env.SERVER_PORT)

app.use(cors())
app.use(body_parser.json())

app.use(admin_route)
app.use(answer_route)
app.use(code_route)
app.use(file_route)
app.use(quiz_route)
app.use(question_route)
app.use(presentation_route)
app.use(settings_route)
app.use(tab_route)
app.use(user_auth_route)
app.use(vote_route)

app.listen(port, async () => {
  console.log(`  ➜ 🎸 Server is listening on port: ${port}`)
})

const {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_PORT,
  POSTGRES_ADMIN_DB
} = process.env
const base_options: SequelizeOptions = {
  port: POSTGRES_PORT as unknown as number,
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
}
const db_admin_connection = new DBConnection({ ...base_options, database: POSTGRES_ADMIN_DB }, AdminModels)

db_admin_connection.initDbConnection()
