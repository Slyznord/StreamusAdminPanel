import VoteModel from '../models/vote.model'
import type { vote } from './types'

class VoteController {
  public async getVotes () {
    try {
      return await VoteModel.findAll()
    } catch (error) {
      throw error
    }
  }

  public async getVotesByTabID (tab_id: number) {
    try {
      return await VoteModel.findAll({
        where: {
          tab_id
        }
      })
    } catch (error) {
      throw error
    }
  }

  public async createVote (votes: vote[]) {
    try {
      await VoteModel.bulkCreate(votes)

      return {
        success: true,
        message: 'OK'
      }
    } catch (error) {
      throw error
    }
  }
}

export default VoteController
