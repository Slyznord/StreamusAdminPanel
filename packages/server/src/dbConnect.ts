import { Sequelize, SequelizeOptions } from 'sequelize-typescript'
import dotenv from 'dotenv'

dotenv.config()

const {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  POSTGRES_PORT
} = process.env
const options:SequelizeOptions = {
  host: 'localhost',
  port: POSTGRES_PORT as unknown as number,
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  dialect: 'postgres',
}
const sequelize = new Sequelize(options)

export async function connect () {
  try {
    await sequelize.authenticate()
    await sequelize.sync()

    console.log('Connection has been established successfully.')
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
}

export { sequelize }