import type { SequelizeOptions } from 'sequelize-typescript'
import dotenv from 'dotenv'
import AdminModels from '../models/admin'
import { initModels } from '../utils/initModels'

dotenv.config()

export default {
  async initAdminDB () {
    const {
      POSTGRES_USER,
      POSTGRES_PASSWORD,
      POSTGRES_ADMIN_DB,
      POSTGRES_PORT
    } = process.env
    const options:SequelizeOptions = {
      host: 'localhost',
      port: POSTGRES_PORT as unknown as number,
      username: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
      database: POSTGRES_ADMIN_DB,
      dialect: 'postgres',
    }

    await initModels(options, AdminModels)
  },
  async initUserDB () {
    const {
      POSTGRES_USER,
      POSTGRES_PASSWORD,
      POSTGRES_USER_DB,
      POSTGRES_PORT
    } = process.env
    const options:SequelizeOptions = {
      host: 'localhost',
      port: POSTGRES_PORT as unknown as number,
      username: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
      database: POSTGRES_USER_DB,
      dialect: 'postgres',
    }

    await initModels(options, [])
  }
}