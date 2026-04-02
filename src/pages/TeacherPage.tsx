import { TeacherDashboard } from '../components/TeacherDashboard'
import { mockPosts, mockProfiles } from '../data/mockData'

export function TeacherPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">교사 대시보드</h1>
      <TeacherDashboard posts={mockPosts} profiles={mockProfiles} />
    </div>
  )
}
