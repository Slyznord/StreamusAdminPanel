import Api from '@/api/api'

export default {
  namespaced: true,
  state: {
    votes: []
  },
  mutations: {
    addVote (state, { id, section, presentations }) {
      state.votes.push({
        id,
        section,
        presentations
      })
    },
    setVotes (state, votes) {
      state.votes = votes
    }
  },
  actions: {
    async getPresentations ({ commit }, id) {
      return Api.get('/v2/presentations', {
        id
      })
    },
    async getVote () {
      return Api.get('v2/votes')
    },
    async getReport ({ commit }, id) {
      return await Api.get(`v2/vote/${id}/report`)
    },
    async saveVote ({ commit }, { sectionId, sectionName, presentations }) {
      return Api.post('v2/vote', {
        data: {
          sectionId,
          sectionName,
          presentations
        }
      })
    },
    async updateVote ({ commit }, { id, sectionId, sectionName, presentations }) {
      return Api.put('v2/vote', {
        params: {
          id
        },
        data: {
          sectionId,
          sectionName,
          presentations
        }
      })
    },
    async deleteVote ({ commit }, id) {
      return Api.delete('/v2/vote', {
        params: {
          id
        }
      })
    },
    async deletePresentation ({ commit }, id) {
      return Api.delete('/v2/presentation', {
        params: {
          id
        }
      })
    }
  }
}
