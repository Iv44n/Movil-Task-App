import { Model, Query, Relation } from '@nozbe/watermelondb'
import { date, readonly, text, children, immutableRelation, writer } from '@nozbe/watermelondb/decorators'
import Project from './Project'
import { TABLE_NAMES } from '@/lib/schema'
import User from './User'
import Subtask from './Subtask'
import { StatusTask } from '@/constants/constants'

export default class Task extends Model {
  static table = 'tasks'

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  static associations = {
    [TABLE_NAMES.USERS]: { type: 'belongs_to', key: 'user_id' },
    [TABLE_NAMES.PROJECTS]: { type: 'belongs_to', key: 'project_id' },
    [TABLE_NAMES.SUBTASKS]: { type: 'has_many', foreignKey: 'task_id' }
  } as const

  @text('user_id') userId!: string
  @text('project_id') projectId!: string
  @text('title') title!: string
  @text('status') status!: string
  @text('priority') priority!: string
  @date('start_date') startDate!: Date | null
  @date('due_date') dueDate!: Date | null

  @immutableRelation(TABLE_NAMES.USERS, 'user_id') user!: Relation<User>
  @immutableRelation(TABLE_NAMES.PROJECTS, 'project_id') project!: Relation<Project>
  @children(TABLE_NAMES.SUBTASKS) subtasks!: Query<Subtask>

  @writer async setStatus(newStatus: string) {
    const proj = await this.project
    await this.batch(
      this.prepareUpdate(task => {
        task.status = newStatus
      }),
      proj.prepareUpdate(p => {
        p.completedTaskCount += (newStatus === StatusTask.COMPLETED ? 1 : -1)
      })
    )
    return this
  }
}
