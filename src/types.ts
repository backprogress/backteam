export type ApplicationStatus = 'pending' | 'accepted' | 'rejected'
export type PostStatus = 'active' | 'closed'

export interface Profile {
  id: string
  name: string
  phone: string
  email: string
  grade: number | null
  class: number | null
  number: number | null
  is_teacher: boolean
  tech_stacks: string[]
}

export interface Post {
  id: string
  author_id: string
  title: string
  content: string
  recruitment_count: number
  tech_required: string[]
  custom_questions: string[]
  deadline: string
  status: PostStatus
}

export interface Application {
  id: string
  post_id: string
  applicant_id: string
  answers: Record<string, string>
  status: ApplicationStatus
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  message: string
  is_read: boolean
  link: string
}
