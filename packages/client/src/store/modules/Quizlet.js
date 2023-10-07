import { apiVersion } from '@/api/api.config'
import Api from '@/api/api'

export default {
  namespaced: true,
  state: {
    attemptToReconnect: 0,
    createdQuiz: null,
    quizzes: null,
    websocket: null
  },
  mutations: {
    addAnswer (state, questionIndex) {
      state.createdQuiz.questions[questionIndex].answers.push({
        content: '',
        img: '',
        is_right: false
      })
    },
    addQuestion (state) {
      state.createdQuiz.questions.push({
        img: '',
        content: '',
        answers: []
      })
    },
    deleteAnswer (state, { questionIndex, answerIndex }) {
      state.createdQuiz.questions[questionIndex].answers.splice(answerIndex, 1)
    },
    deleteQuestion (state, index) {
      state.createdQuiz.questions.splice(index, 1)
    },
    deleteQuiz (state, id) {
      const quizIndex = state.quizzes.find(quiz => quiz.quiz_id === id)
      state.quizzes.splice(quizIndex, 1)
    },
    initCreatedQuiz (state, quiz) {
      state.createdQuiz = quiz ?? {
        is_active: false,
        introduction_text: '',
        duration: '',
        logo: 'qweqweqwe',
        background: '',
        questions: []
      }
    },
    setQuizzes (state, payload) {
      state.quizzes = payload
    },
    updateAnswer (state, { questionIndex, answerIndex, value, key }) {
      state.createdQuiz.questions[questionIndex].answers[answerIndex][key] = value
    },
    updateCreatedQuiz (state, { value, key }) {
      state.createdQuiz[key] = value
    },
    updateQuestion (state, { index, value }) {
      state.createdQuiz.questions[index].content = value
    }
  },
  actions: {
    async createQuiz ({ dispatch, state }, quiz) {
      await Api.post(`${apiVersion}/quiz`, {
        data: quiz
      })
      await dispatch('getQuizzes')
    },
    async deleteAnswer ({ commit }, id) {
      await Api.delete(`${apiVersion}/answer`, {
        data: {
          answer_id: id
        }
      })
    },
    async deleteQuestion ({ commit }, id) {
      await Api.delete(`${apiVersion}/question`, {
        data: {
          question_id: id
        }
      })
    },
    async deleteQuiz ({ commit }, id) {
      await Api.delete(`${apiVersion}/quiz`, {
        data: {
          quiz_id: id
        }
      })
      commit('deleteQuiz', id)
    },
    async generateReport ({ commit }, quizletID) {
      return await Api.get(`/v2/quiz/${quizletID}/report`)
    },
    async getQuizzes ({ commit }) {
      const quizzes = await Api.get(`${apiVersion}/quizzes`)
      commit('setQuizzes', quizzes.data)
    },
    async switchQuizState ({ commit, state }, { id, value }) {
      await Api.put(`${apiVersion}/quiz/switch_state`, {
        data: {
          quiz_id: id,
          value
        }
      })
    },
    async updateQuiz ({ commit, state }, quiz) {
      await Api.put(`${apiVersion}/quiz`, {
        data: quiz
      })
    },
    async uploadFile ({ commit }, file) {
      return await Api.post('v2/file', {
        data: file
      }).then(res => res.file)
    }
  }
}
