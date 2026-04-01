import { useMemo, useState } from 'react'
import { techStackOptions } from '../data/mockData'
import type { Post } from '../types'
import { TechBadge } from './TechBadge'

interface MainFeedProps {
  posts: Post[]
}

export function MainFeed({ posts }: MainFeedProps) {
  const [selectedStack, setSelectedStack] = useState<string>('all')

  const sortedPosts = useMemo(() => {
    // 한국어 주석: 선택한 기술 스택으로 필터링하고 마감일 임박 순으로 정렬합니다.
    return posts
      .filter((post) => selectedStack === 'all' || post.tech_required.includes(selectedStack))
      .sort(
        (a, b) =>
          new Date(a.deadline).getTime() - new Date(b.deadline).getTime(),
      )
  }, [posts, selectedStack])

  return (
    <section className="space-y-4">
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
        <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">기술 스택 필터</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedStack('all')}
            className={`rounded-full px-3 py-1 text-sm ${
              selectedStack === 'all' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            전체
          </button>
          {techStackOptions.map((stack) => (
            <button
              key={stack.key}
              type="button"
              onClick={() => setSelectedStack(stack.key)}
              className={`rounded-full px-3 py-1 text-sm ${
                selectedStack === stack.key ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
              }`}
            >
              {stack.icon} {stack.label}
            </button>
          ))}
        </div>
      </div>

      <ul className="grid gap-4 md:grid-cols-2">
        {sortedPosts.map((post) => (
          <li key={post.id} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm">
            <p className="mb-2 text-xs font-semibold text-blue-600 dark:text-blue-400">마감일 {post.deadline}</p>
            <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">{post.title}</h3>
            <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">{post.content}</p>
            <div className="mb-3 flex flex-wrap gap-2">
              {post.tech_required.map((stack) => (
                <TechBadge key={stack} stackKey={stack} />
              ))}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">모집 인원: {post.recruitment_count}명</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
