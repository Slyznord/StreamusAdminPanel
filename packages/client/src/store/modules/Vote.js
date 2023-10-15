import Api from '@/api/api'
import { apiVersion } from '@/api/api.config'

export default {
  namespaced: true,
  state: {
    votes: []
  },
  mutations: {
    setVotes (state, votes) {
      state.votes = votes
    }
  },
  actions: {
    async createPresentation ({ state }, data) {
      return await Api.post(`${apiVersion}/presentation`, { data })
    },
    async createVote ({ state }, data) {
      return await Api.post(`${apiVersion}/vote`, { data })
    },
    async deletePresentation ({ state }, data) {
      return await Api.delete(`${apiVersion}/presentation`, { data })
    },
    async getVotes ({ state }, params = {}) {
      return await Api.get(`${apiVersion}/vote`, params).then(res => res.data || [])
    },
    async deleteVote ({ state }, data) {
      return await Api.delete(`${apiVersion}/vote`, { data })
    },
    async updatePresentation ({ state }, data) {
      return await Api.put(`${apiVersion}/presentation`, { data })
    },
    async updateVote ({ state }, data) {
      return await Api.put(`${apiVersion}/vote`, { data })
    }
  }
}
