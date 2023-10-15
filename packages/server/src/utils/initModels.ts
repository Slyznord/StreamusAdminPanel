import type { Sequelize, SequelizeOptions, ModelCtor } from 'sequelize-typescript'
import { connect } from './dbConnect'

export async function initModels (options: SequelizeOptions, models: ModelCtor[]) {
  try {
    const sequelize: Sequelize | null = await connect(options)

    if (!sequelize) return

    sequelize.addModels(models)
  } catch (error) {
    console.error(error)
  }
}