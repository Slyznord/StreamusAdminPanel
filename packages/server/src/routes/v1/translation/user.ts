import { Router } from 'express'
import { ROUTES_VERSION } from '../../../constants'
import UserController from '../../../controllers/admin/user.controller'

const router = Router()
const CURRENT_ROUTE = `${ROUTES_VERSION}/code`
const code_instance = new UserController()

router.get(`${ROUTES_VERSION}/codes`, async (_req: any, res: any) => {
  try {
    const codes = await code_instance.getCodes()

    res.json({
      success: true,
      data: codes
    })
  } catch (error) {
    res.status(400).send(error)
  }
})

router.post(CURRENT_ROUTE, async (req: any, res: any) => {
  try {
    const { code } = req.body

    if (!code) {
      return res.status(400).send({
        success: false,
        message: 'Property code is required.'
      })
    }

    const response = await code_instance.createCode({ code })

    res.json(response)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.post(`${ROUTES_VERSION}/codes`, async (req: any, res: any) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded')
  }

  try {
    code_instance.importCodesFromFile(req.files.file)

    res.json({
      success: true,
      message: 'OK'
    })
  } catch (error) {
    res.status(400).send(error)
  }
})

router.put(CURRENT_ROUTE, async (req: any, res: any) => {
  try {
    const { code_id, code } = req.body

    if (!(code_id && code)) {
      return res.status(400).send({
        success: false,
        message: 'Properties code and code_id are required.'
      })
    }

    const response = await code_instance.updateCode({ code_id, code })

    res.json(response)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.put(`${CURRENT_ROUTE}/user`, async (req: any, res: any) => {
  try {
    const { code_id, name, email } = req.body

    if (!(code_id && name && email)) {
      return res.status(400).send({
        success: false,
        message: 'Properties code_id, name and email are required.'
      })
    }

    const last_activity = Date.now()
    const response = await code_instance.updateUserData({ code_id, name, email, last_activity })

    return res.json(response)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.delete(CURRENT_ROUTE, async (req: any, res: any) => {
  try {
    const { code_id } = req.body

    if (!code_id) {
      return res.status(400).send({
        success: false,
        message: 'Property code_id is required.'
      })
    }

    const response = await code_instance.deleteCode(code_id)

    res.json(response)
  } catch (error) {
    res.status(400).send(error)
  }
})

router.delete(`${ROUTES_VERSION}/codes`, async (_req: any, res: any) => {
  try {
    const response = await code_instance.deleteCodes()

    res.json(response)
  } catch (error) {
    res.status(400).send(error)
  }
})

export default router
