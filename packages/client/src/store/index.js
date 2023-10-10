import { createStore } from 'vuex'

import Auth from './modules/Auth'
import Quizlet from './modules/Quizlet'
import Translation from './modules/Translation'
import Vote from './modules/Vote'

export default createStore({
  modules: {
    Auth,
    Quizlet,
    Translation,
    Vote
  }
})
