import express from 'express'

import body_parser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'

import { connect as db_connect } from './dbConnect'
import models from './init/models'

import admin_route from './routes/v1/admin/auth'
import answer_route from './routes/v1/quiz/answer'
import code_route from './routes/v1/translation/user'
import file_route from './routes/v1/file'
import quiz_route from './routes/v1/quiz/quiz'
import question_route from './routes/v1/quiz/question'
import settings_route from './routes/v1/translation/settings'
import tab_route from './routes/v1/translation/tab'
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
app.use(settings_route)
app.use(tab_route)
app.use(vote_route)

app.listen(port, async () => {
  console.log(`  ➜ 🎸 Server is listening on port: ${port}`)
  await db_connect()
})

models.init()
