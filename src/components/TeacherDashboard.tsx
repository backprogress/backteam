import type { Post, Profile } from '../types'

interface TeacherDashboardProps {
  posts: Post[]
  profiles: Profile[]
}

export function TeacherDashboard({ posts, profiles }: TeacherDashboardProps) {
  const studentProfiles = profiles.filter((profile) => !profile.is_teacher && profile.grade !== null)
  const gradeStats = studentProfiles.reduce<Record<number, number>>((acc, profile) => {
    const grade = profile.grade ?? 0
    acc[grade] = (acc[grade] ?? 0) + 1
    return acc
  }, {})

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold text-slate-900">교사 통계 대시보드</h2>
      <div className="grid gap-3 md:grid-cols-3">
        <article className="rounded-lg bg-slate-50 p-3">
          <p className="text-sm text-slate-500">전체 프로젝트</p>
          <p className="text-2xl font-bold text-slate-900">{posts.length}</p>
        </article>
        <article className="rounded-lg bg-slate-50 p-3">
          <p className="text-sm text-slate-500">활동 학생</p>
          <p className="text-2xl font-bold text-slate-900">{studentProfiles.length}명</p>
        </article>
        <article className="rounded-lg bg-slate-50 p-3">
          <p className="text-sm text-slate-500">활성 공고</p>
          <p className="text-2xl font-bold text-slate-900">
            {posts.filter((post) => post.status === 'active').length}건
          </p>
        </article>
      </div>
      <div className="mt-4 rounded-lg border border-slate-200 p-3">
        <p className="mb-2 text-sm font-semibold text-slate-700">학년별 활동 학생 수</p>
        <ul className="space-y-1 text-sm text-slate-600">
          {[1, 2, 3].map((grade) => (
            <li key={grade}>
              {grade}학년: {gradeStats[grade] ?? 0}명
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
