import { Model, Query, Relation } from '@nozbe/watermelondb'
import { children, date, field, immutableRelation, readonly, relation, text, writer } from '@nozbe/watermelondb/decorators'
import { TABLE_NAMES } from '@/lib/schema'
import Category from './Category'
import Task from './Task'
import User from './User'

interface UpdateProjectParams {
  name?: string
  description?: string
  color?: string
  categoryId?: string
  progressPercentage?: number
}

export default class Project extends Model {
  static table = TABLE_NAMES.PROJECTS

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  static associations = {
    [TABLE_NAMES.USERS]: { type: 'belongs_to', key: 'user_id' },
    [TABLE_NAMES.CATEGORIES]: { type: 'belongs_to', key: 'category_id' },
    [TABLE_NAMES.TASKS]: { type: 'has_many', foreignKey: 'project_id' }
  } as const

  @text('user_id') userId!: string
  @text('name') name!: string
  @text('description') description!: string
  @text('color') color!: string
  @text('category_id') categoryId!: string
  @field('progress_percentage') progressPercentage!: number

  @immutableRelation(TABLE_NAMES.USERS, 'user_id') user!: Relation<User>
  @relation(TABLE_NAMES.CATEGORIES, 'category_id') category!: Relation<Category>
  @children(TABLE_NAMES.TASKS) tasks!: Query<Task>

  @writer async updateProject(updates: UpdateProjectParams) {
    return await this.update(p => {
      if (updates.name !== undefined) p.name = updates.name
      if (updates.description !== undefined) p.description = updates.description
      if (updates.color !== undefined) p.color = updates.color
      if (updates.categoryId !== undefined) p.categoryId = updates.categoryId
      if (updates.progressPercentage !== undefined) p.progressPercentage = updates.progressPercentage
    })
  }

  @writer async deleteProject() {
    await this.tasks.destroyAllPermanently()
    await super.destroyPermanently()
  }
}
