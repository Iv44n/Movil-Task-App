import { TABLE_NAMES } from '@/lib/schema'
import { Model, Query, Relation } from '@nozbe/watermelondb'
import { children, date, immutableRelation, text, writer } from '@nozbe/watermelondb/decorators'
import User from './User'
import Project from './Project'

export default class Category extends Model {
  static table = 'categories'

  static associations = {
    [TABLE_NAMES.USERS]: { type: 'belongs_to', key: 'user_id' },
    [TABLE_NAMES.PROJECTS]: { type: 'has_many', foreignKey: 'category_id' }
  } as const

  @text('user_id') userId!: string
  @text('name') name!: string
  @date('created_at') createdAt!: Date
  @date('updated_at') updatedAt!: Date

  @immutableRelation(TABLE_NAMES.USERS, 'user_id') user!: Relation<User>
  @children(TABLE_NAMES.PROJECTS) projects!: Query<Project>

  @writer async deleteCategory() {
    const hasProjects = await this.projects.extend().fetchCount()
    if (hasProjects > 0) {
      throw new Error('Category is in use')
    }

    await this.destroyPermanently()
  }
}
