import AnswersModel from '../models/answers.model'
import QuizModel from '../models/quiz.model'
import QuestionModel from '../models/question.model'
import type { quiz } from './types'

class QuizController {
  async getQuizzes () {
    try {
      return await QuizModel.findAll({
        include: [
          {
            model: QuestionModel,
            include: [AnswersModel]
          }
        ]
      })
    } catch (error) {
      throw error
    }
  }

  async getQuiz (quiz_id:number) {
    try {
      return await QuizModel.findOne({
        where: {
          quiz_id
        },
        include: QuestionModel
      })
    } catch (error) {
      throw error
    }
  }

  async createQuiz ({ introduction_text, duration, logo, background }: quiz) {
    try {
      return await QuizModel.create({
        introduction_text,
        duration,
        logo,
        background
      })
    } catch (error) {
      throw error
    }
  }

  async deleteQuiz (quiz_id: number) {
    try {
      const quiz = await this.getQuiz(quiz_id)

      if (!quiz) {
        return {
          success: false,
          message: 'Quiz wasn\'t found'
        }
      }

      // @ts-ignore
      await quiz.destroy()

      return {
        success: true,
        message: 'OK'
      }
    } catch (error) {
      throw error
    }
  }

  async deleteQuizzes () {
    try {
      await QuizModel.truncate({ cascade: true })
    } catch (error) {
      throw error
    }
  }

  async updateQuiz ({ quiz_id, introduction_text, duration, logo, background }: quiz) {
    try {
      await QuizModel.update({
        introduction_text,
        duration,
        logo,
        background
      }, {
        returning: true,
        where: {
          quiz_id: quiz_id as number
        }
      })

      return {
        success: true,
        message: 'OK'
      }
    } catch (error) {
      throw error
    }
  }

  async switchState ({ quiz_id, value }: { quiz_id: number, value: boolean }) {
    try {
      await QuizModel.update({
        is_active: value
      }, {
        returning: true,
        where: {
          quiz_id
        }
      })

      return {
        success: true,
        message: 'OK'
      }
    } catch (error) {
      throw error
    }
  }
}

export default QuizController
