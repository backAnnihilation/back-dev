import { Column, Table, Model, DataType } from 'sequelize-typescript';

@Table
export class UserSubscription extends Model<UserSubscription> {
  @Column({ type: DataType.STRING })
  followerId: string;

  @Column({ type: DataType.STRING })
  followingId: string;

  @Column({
    type: DataType.DATE,
    defaultValue: DataType.NOW,
  })
  createdAt: Date;
}
