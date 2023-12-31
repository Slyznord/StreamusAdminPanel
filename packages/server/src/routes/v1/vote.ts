import PresentationController from '../../controllers/admin/presentation.controller'
import VoteController from '../../controllers/admin/vote.controller'
import type { presentation } from '../../controllers/admin/types'
import { Router } from 'express'
import { ROUTES_VERSION } from '../../constants'

const router = Router()
const CURRENT_ROUTE = `${ROUTES_VERSION}/vote`
const presentation_instance = new PresentationController()
const vote_instance = new VoteController()

router.get(CURRENT_ROUTE, async (req: any, res: any) => {
  try {
    const { vote_id } = req.query
    const votes = vote_id ? await vote_instance.getVote(vote_id) : await vote_instance.getVotes()

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
    const { tab_name, tab_id, presentations } = req.body

    if (!(tab_name && tab_id && presentations.length)) {
      res.status(400).send({
        success: false,
        message: 'You have to send array of object like [{ tab_id, tab_name, presentations: [] }].'
      })

      return
    }

    const vote = await vote_instance.createVote({ tab_id, tab_name })
    const mapped_presentations = presentations.map((item: presentation) => {
      return {
        ...item,
        vote_id: vote.dataValues.vote_id
      }
    })
    const response = await presentation_instance.createPresentations(mapped_presentations)

    res.json(response)
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error
    })
  }
})

router.put(CURRENT_ROUTE, async (req: any, res: any) => {
  try {
    const { tab_name, tab_id, vote_id } = req.body

    if (!(tab_name && tab_id && vote_id)) {
      res.status(400).send({
        success: false,
        message: 'Properties tab_name, tab_id and vote_id are required.'
      })

      return
    }

    const response = await vote_instance.updateVote({ tab_name, tab_id, vote_id })
    res.json(response)
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error
    })
  }
})

router.delete(CURRENT_ROUTE, async (req: any, res: any) => {
  try {
    const { vote_id } = req.body

    if (!vote_id) {
      res.json({
        success: false,
        message: 'Property vote_id is required.'
      })

      return
    }

    const response = await vote_instance.deleteVote(vote_id)
    res.json(response)
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error
    })
  }
})

export default router
