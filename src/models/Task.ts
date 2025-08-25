import { Model, Query, Relation } from '@nozbe/watermelondb'
import { date, readonly, text, children, immutableRelation, writer, field } from '@nozbe/watermelondb/decorators'
import Project from './Project'
import { TABLE_NAMES } from '@/lib/schema'
import User from './User'
import Subtask from './Subtask'
import { Priority, StatusTask } from '@/constants/constants'

interface UpdateTaskParams {
  title?: string
  status?: StatusTask
  priority?: Priority
  startDate?: Date | null
  dueDate?: Date | null
  progressPercentage?: number
}

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
  @text('status') status!: StatusTask
  @text('priority') priority!: Priority
  @date('start_date') startDate!: Date | null
  @date('due_date') dueDate!: Date | null
  @field('progress_percentage') progressPercentage!: number

  @immutableRelation(TABLE_NAMES.USERS, 'user_id') user!: Relation<User>
  @immutableRelation(TABLE_NAMES.PROJECTS, 'project_id') project!: Relation<Project>
  @children(TABLE_NAMES.SUBTASKS) subtasks!: Query<Subtask>

  @writer async updateTask(updates: UpdateTaskParams) {
    return await this.update(p => {
      if (updates.title !== undefined) p.title = updates.title
      if (updates.status !== undefined) p.status = updates.status
      if (updates.priority !== undefined) p.priority = updates.priority
      if (updates.startDate !== undefined) p.startDate = updates.startDate
      if (updates.dueDate !== undefined) p.dueDate = updates.dueDate
      if (updates.progressPercentage !== undefined) p.progressPercentage = updates.progressPercentage
    })
  }

  @writer async setStatus(newStatus: StatusTask) {
    if (this.status === newStatus) return this
    await this.batch(
      this.prepareUpdate(task => {
        task.status = newStatus
      })
    )
    return this
  }

  @writer async deleteTask() {
    await this.subtasks.destroyAllPermanently()
    await super.destroyPermanently()
  }
}
