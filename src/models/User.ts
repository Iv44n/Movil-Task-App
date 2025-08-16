import { TABLE_NAMES } from '@/lib/schema'
import { Model } from '@nozbe/watermelondb'
import { date, readonly, text } from '@nozbe/watermelondb/decorators'

export default class User extends Model {
  static table = TABLE_NAMES.USERS

  @readonly @date('created_at') createdAt!: Date
  @readonly @date('updated_at') updatedAt!: Date

  @text('first_name') firstName!: string
  @text('last_name') lastName!: string
  @text('email') email!: string

  @text('profile_image_url') profileImageUrl!: string | null
  @text('profile_image_local_path') profileImageLocalPath!: string | null
}
