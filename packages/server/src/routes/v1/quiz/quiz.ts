import { Router } from 'express'
import { ROUTES_VERSION } from '../../../constants'
import type { answer, question } from '../../../controllers/admin/types'

import AnswerController from '../../../controllers/admin/answer.controller'
import QuizController from '../../../controllers/admin/quiz.controller'
import QuestionController from '../../../controllers/admin/question.controller'

const router = Router()
const CURRENT_ROUTE = `${ROUTES_VERSION}/quiz`

const answer_instance = new AnswerController()
const quiz_instance = new QuizController()
const question_instance = new QuestionController()

router.get(CURRENT_ROUTE, async (req: any, res: any) => {
  const { quiz_id = null } = req.query

  if (!quiz_id) {
    return res.status(400).send({
      success: false,
      message: 'Param quiz_id is required.'
    })
  }

  try {
    const quiz = await quiz_instance.getQuiz(parseInt(quiz_id))

    return res.json({
      success: true,
      data: quiz
    })
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error
    })
  }
})

router.get(`${ROUTES_VERSION}/quizzes`, async (_req: any, res: any) => {
  try {
    const quizzes = await quiz_instance.getQuizzes()

    res.json({
      success: true,
      data: quizzes
    })
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error
    })
  }
})

router.post(CURRENT_ROUTE, async (req: any, res: any) => {
  const { introduction_text, duration, logo, background, questions } = req.body

  if (!(introduction_text && duration && logo && background && questions)) {
    return res.status(400).send({
      success: false,
      message: 'Properties introduction_text, duration, logo, background and questions are required.'
    })
  }

  try {
    const quiz: any = await quiz_instance.createQuiz({
      introduction_text,
      duration,
      logo,
      background
    })
    const mapped_questions = questions.map((item: question) => {
      return {
        ...item,
        quiz_id: quiz.dataValues.quiz_id
      }
    })
    const added_questions = await question_instance.createQuestion(mapped_questions)
    const answers = questions.map((item: question) => {
      return item.answers
    })
    const mapped_answers = answers.map((answers: answer[], index: number) => {
      return answers.map((answer: answer) => {
        return {
          ...answer,
          question_id: added_questions[index].dataValues.question_id
        }
      })
    })

    await Promise.all(mapped_answers.map(async (item: answer[]) => {
      await answer_instance.createAnswer(item)
    }))

    res.json({
      success: true,
      message: 'OK'
    })
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error
    })
  }
})

router.put(CURRENT_ROUTE, async (req: any, res: any) => {
  const { quiz_id, introduction_text, duration, logo, background, questions } = req.body

  if (!(introduction_text && duration && logo && background && questions)) {
    return res.status(400).send({
      success: false,
      message: 'Properties introduction_text, duration, logo, background and questions are required.'
    })
  }

  try {
    await quiz_instance.updateQuiz({
      quiz_id,
      introduction_text,
      duration,
      logo,
      background
    })

    await Promise.all(questions.map(async (question: question) => {
      const updated_question = await question_instance.updateQuestion({ ...question, quiz_id })
      const { answers } = question

      await Promise.all(answers.map(async (answer: answer) => {
        await answer_instance.updateAnswer({
          ...answer,
          // @ts-ignore
          question_id: updated_question[0].dataValues.question_id
        })
      }))
    }))

    res.json({
      success: true,
      message: 'OK'
    })
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error
    })
  }
})

router.put(`${CURRENT_ROUTE}/switch_state`, async (req: any, res: any) => {
  const { quiz_id, value = null } = req.body

  if (!(quiz_id && !(value === null))) {
    return res.status(400).send({
      success: false,
      message: 'Properties quiz_id and value are required.'
    })
  }

  const response = await quiz_instance.switchState({ quiz_id, value })

  if (response.success) {
    return res.json(response)
  }
})

router.delete(CURRENT_ROUTE, async (req: any, res: any) => {
  const { quiz_id = null } = req.body

  if (!quiz_id) {
    return res.status(400).send({
      success: false,
      message: 'Param quiz_id is required.'
    })
  }

  try {
    const response = await quiz_instance.deleteQuiz(quiz_id)

    res.json(response)
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error
    })
  }
})

router.delete(`${ROUTES_VERSION}/quizzes`, async (_req: any, res: any) => {
  try {
    await quiz_instance.deleteQuizzes()

    return res.json({
      success: true,
      message: 'OK'
    })
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: error
    })
  }
})

export default router
