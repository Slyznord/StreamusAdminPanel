import Api from '@/api/api'
import { apiVersion } from '@/api/api.config'
export default {
  namespaced: true,
  state: {
    codes: null,
    settings: null,
    tabs: null
  },
  mutations: {
    addCode (state) {
      state.codes.unshift({
        code: '',
        email: '',
        name: '',
        last_activity: '',
        is_online: false,
        isEditing: true
      })
    },
    addTab (state) {
      state.tabs.push({ isEditing: true })
    },
    deleteCode (state, codeID) {
      const codeIndex = state.codes.find(item => item.code_id === codeID)
      state.codes.splice(codeIndex, 1)
    },
    deleteCodes (state) {
      state.codes = []
    },
    deleteTab (state, index) {
      state.tabs.splice(index, 1)
    },
    setCodes (state, codes) {
      state.codes = codes
    },
    setEditingStatus (state, { key, index, value }) {
      state[key][index].isEditing = value
    },
    setSettings (state, settings) {
      state.settings = settings
    },
    setTabs (state, tabs) {
      state.tabs = tabs
    },
    updateCode (state, { index, value }) {
      state.codes[index].code = value
    },
    updateSettings (state, { property, value }) {
      state.settings[property] = value
    },
    updateTab (state, { index, key, value }) {
      state.tabs[index][key] = value
    }
  },
  actions: {
    async createCode ({ commit }, codes) {
      await Api.post(`${apiVersion}/code`, {
        data: codes
      })
    },
    async createTab ({ commit }, { name, url }) {
      await Api.post(`${apiVersion}/tab`, {
        data: {
          name,
          url
        }
      })
    },
    async deleteCode ({ commit }, id) {
      await Api.delete(`${apiVersion}/code`, {
        data: {
          code_id: id
        }
      })
    },
    async deleteCodes ({ commit }) {
      await Api.delete(`${apiVersion}/codes`, {})
      commit('deleteCodes')
    },
    async deleteTab ({ dispatch }, id) {
      await Api.delete(`${apiVersion}/tab`, {
        data: {
          tab_id: id
        }
      })
    },
    async getCodes () {
      return await Api.get(`${apiVersion}/codes`, {}).then(res => res.data)
    },
    async getSettings ({ commit }) {
      return await Api.get(`${apiVersion}/settings`)
    },
    async getTabs () {
      return await Api.get(`${apiVersion}/tabs`, {}).then(res => res.data)
    },
    async saveSettings ({ commit, dispatch, state }) {
      await Api.put(`${apiVersion}/settings`, {
        data: state.settings
      })

      const { data: settings } = await dispatch('getSettings')
      commit('setSettings', settings)
    },
    async updateCode ({ commit }, { code_id: codeID, code }) {
      await Api.put(`${apiVersion}/code`, {
        data: {
          code_id: codeID,
          code
        }
      })
    },
    async updateTab ({ commit }, { tab_id: tabID, name, url }) {
      await Api.put(`${apiVersion}/tab`, {
        data: {
          tab_id: tabID,
          name,
          url
        }
      })
    },
    async uploadFile ({ commit }, file) {
      return await Api.post(`${apiVersion}/file`, {
        data: file
      })
    }
  }
}
