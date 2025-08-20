import { TABLE_NAMES } from '@/lib/schema'
import { Model, Relation } from '@nozbe/watermelondb'
import { date, field, immutableRelation, readonly, text, writer } from '@nozbe/watermelondb/decorators'
import Task from './Task'

export default class Subtask extends Model {
  static table = TABLE_NAMES.SUBTASKS

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  static associations = {
    [TABLE_NAMES.TASKS]: { type: 'belongs_to', key: 'task_id' }
  } as const

  @text('task_id') taskId!: string
  @text('text') text!: string
  @field('completed') completed!: boolean

  @immutableRelation(TABLE_NAMES.TASKS, 'task_id') task!: Relation<Task>

  @writer async toggleCompleted(value?: boolean) {
    if (this.completed === value) return

    await this.update(s => {
      s.completed = value ?? !s.completed
    })
  }
}
