import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { techStackOptions, mockPosts } from '../data/mockData'
import { TechBadge } from '../components/TechBadge'

export function FeedPage() {
  const [selectedStack, setSelectedStack] = useState<string>('all')

  const sortedPosts = useMemo(() => {
    // 선택한 기술 스택으로 필터링하고 마감일 임박 순으로 정렬합니다.
    return mockPosts
      .filter((post) => selectedStack === 'all' || post.tech_required.includes(selectedStack))
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
  }, [selectedStack])

  return (
    <div className="space-y-6">
      {/* 기술 스택 필터 */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4">
        <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">기술 스택 필터</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedStack('all')}
            className={`rounded-full px-3 py-1 text-sm transition-colors ${
              selectedStack === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
            }`}
          >
            전체
          </button>
          {techStackOptions.map((stack) => (
            <button
              key={stack.key}
              type="button"
              onClick={() => setSelectedStack(stack.key)}
              className={`rounded-full px-3 py-1 text-sm transition-colors ${
                selectedStack === stack.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              {stack.icon} {stack.label}
            </button>
          ))}
        </div>
      </div>

      {/* 공고 목록 */}
      {sortedPosts.length === 0 ? (
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-12">
          해당 기술 스택 공고가 없습니다.
        </p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {sortedPosts.map((post) => (
            <li key={post.id}>
              <Link
                to={`/posts/${post.id}`}
                className="block rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 transition-all"
              >
                <p className="mb-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
                  마감일 {post.deadline}
                </p>
                <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100 line-clamp-2">
                  {post.title}
                </h3>
                <p className="mb-4 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{post.content}</p>
                <div className="mb-3 flex flex-wrap gap-2">
                  {post.tech_required.map((stack) => (
                    <TechBadge key={stack} stackKey={stack} />
                  ))}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  모집 인원: {post.recruitment_count}명
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
