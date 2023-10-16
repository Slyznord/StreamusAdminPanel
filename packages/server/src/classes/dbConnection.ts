import { ModelCtor, Sequelize, SequelizeOptions} from 'sequelize-typescript'

class DBConnection {
  private readonly models: ModelCtor[]
  private sequelize: Sequelize

  constructor(options: SequelizeOptions, models: ModelCtor[]) {
    this.sequelize = new Sequelize({
      ...options,
      host: 'localhost',
      dialect: 'postgres',
      logging: (msg) => console.debug(msg)
    })
    this.models = models
  }

  public async connect (): Promise<void> {
    try {
      await this.sequelize.authenticate()
      await this.sequelize.sync()
    } catch (error) {
      console.error(error)
    }
  }

  public appendModels () {
    try {
      this.sequelize.addModels(this.models)
    } catch (error) {
      console.error(error)
    }
  }

  public async initDbConnection () {
    try {
      this.appendModels()
      await this.connect()
    } catch (error) {
      console.error(error)
    }
  }
}

export default DBConnection