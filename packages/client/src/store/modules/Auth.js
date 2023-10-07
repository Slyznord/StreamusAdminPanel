import bcrypt from 'bcryptjs'
import Api from '@/api/api'
import { apiVersion } from '@/api/api.config'

export default {
  namespaced: true,
  state: {
    token: null,
    refreshToken: null
  },
  getters: {
    isLogged (state) {
      return Boolean(state.token)
    }
  },
  mutations: {
    setToken (state, { accessToken, refreshToken }) {
      state.token = accessToken
      state.refreshToken = refreshToken

      localStorage.setItem('werialToken', JSON.stringify({
        accessToken,
        refreshToken
      }))
    }
  },
  actions: {
    async checkToken () {
      return await Api.get(`${apiVersion}/admin/check_token`)
    },
    async login ({ commit }, { username, password }) {
      if (!(username && password)) {
        return { success: false }
      }

      const user = await Api.post(`${apiVersion}/admin/check_user`, {
        data: {
          login: username
        }
      })

      if (!user.data) {
        return { success: false }
      }

      const { data: { salt } } = user
      const passHash = bcrypt.hashSync(password, salt)
      const login = await Api.post(`${apiVersion}/admin/login`, {
        data: {
          login: username,
          pass: passHash
        }
      })

      if (!login.success) {
        return { success: false }
      }

      return login
    }
  }
}
