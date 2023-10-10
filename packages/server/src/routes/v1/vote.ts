import VoteController from '../../controllers/vote.controller'
import { Router } from 'express'
import { ROUTES_VERSION } from '../../constants'

const router = Router()
const CURRENT_ROUTE = `${ROUTES_VERSION}/vote`
const vote_instance = new VoteController()

router.get(CURRENT_ROUTE, async (req: any, res: any) => {
  try {
    const { tab_id } = req.query
    console.log(tab_id)
    const votes = tab_id ? await vote_instance.getVotesByTabID(tab_id) : await vote_instance.getVotes()

    res.json({
      success: true,
      data: votes
    })
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error
    })
  }
})

router.post(CURRENT_ROUTE, async (req: any, res: any) => {
  try {
    const votes = req.body

    if (!votes.length) {
      res.status(400).send({
        success: false,
        message: 'You have to send array of object like [{ tab_id, tab_name, presentation_name }].'
      })
    }

    const response = await vote_instance.createVote(votes)
    res.json(response)
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error
    })
  }
})

export default router
