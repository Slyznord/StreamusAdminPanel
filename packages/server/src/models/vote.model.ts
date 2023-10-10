import {
  AutoIncrement,
  Column,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript'
import { DataTypes } from 'sequelize'


@Table({
  tableName: 'votes',
  paranoid: false,
  timestamps: false
})
class VoteModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataTypes.INTEGER)
  vote_id: number

  @Column(DataTypes.INTEGER)
  tab_id: number

  @Column(DataTypes.STRING)
  tab_name: string

  @Column(DataTypes.STRING)
  presentation_name: string
}

export default VoteModel
