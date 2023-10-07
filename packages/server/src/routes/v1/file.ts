import { Router } from 'express'
import { ROUTES_VERSION } from '../../constants'
import { UPLOAD_PATH } from '../../constants'

const CURRENT_ROUTE = `${ROUTES_VERSION}/file`
const router = Router()

router.post(CURRENT_ROUTE, async (req: any, res: any) => {
  const { files } = req

  if (!files || Object.keys(files).length === 0) {
    return res.status(400).send({
      success: false,
      message: 'No files were uploaded'
    })
  }

  const file = req.files.file
  const path = `${UPLOAD_PATH}/${file.name}`

  file.mv(path, (error: any) => {
    if (!error) {
      res.send({
        file
      })
    } else {
      res.status(400).send({
        success: false,
        message: error
      })
    }
  })
})

export default router