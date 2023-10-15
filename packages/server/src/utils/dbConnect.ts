import { Sequelize, SequelizeOptions } from 'sequelize-typescript'

export async function connect (options: SequelizeOptions): Promise<Sequelize | null> {
  try {
    const sequelize = new Sequelize(options)

    await sequelize.authenticate()
    await sequelize.sync()

    return sequelize
  } catch (error) {
    console.error('Unable to connect to the database:', error)
    return null
  }
}
