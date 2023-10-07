import { sequelize } from '../dbConnect'
import Models from '../models'

export default {
  init () {
    sequelize.addModels(Models)
  }
}