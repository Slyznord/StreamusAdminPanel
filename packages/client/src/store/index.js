import { createStore } from 'vuex'

import Auth from './modules/Auth'
import Quizlet from './modules/Quizlet'
import Translation from './modules/Translation'

export default createStore({
  modules: {
    Auth,
    Quizlet,
    Translation
  }
})
