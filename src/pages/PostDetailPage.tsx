import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { mockPosts } from '../data/mockData'
import { TechBadge } from '../components/TechBadge'

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const post = mockPosts.find((p) => p.id === id)

  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <p className="text-lg text-slate-600 dark:text-slate-400">공고를 찾을 수 없습니다.</p>
        <Link to="/" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline">
          목록으로 돌아가기
        </Link>
      </div>
    )
  }

  const updateAnswer = (question: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [question]: value }))
  }

  const handleApply = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    // 필수 질문 답변 검사
    const unanswered = post.custom_questions.filter((question) => !answers[question]?.trim())
    if (unanswered.length > 0) {
      setError('모든 질문에 답변을 입력해주세요.')
      return
    }

    setSubmitting(true)
    // 모의 지원 제출 (Supabase 미연동 시 로컬 처리)
    await new Promise((resolve) => setTimeout(resolve, 600))
    setSubmitting(false)
    setSubmitted(true)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* 뒤로가기 */}
      <button
        type="button"
        onClick={() => void navigate(-1)}
        className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
      >
        ← 목록으로
      </button>

      {/* 공고 상세 */}
      <article className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
        <p className="mb-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
          마감일 {post.deadline}
        </p>
        <h1 className="mb-3 text-2xl font-bold text-slate-900 dark:text-slate-100">{post.title}</h1>
        <p className="mb-4 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{post.content}</p>
        <div className="mb-4 flex flex-wrap gap-2">
          {post.tech_required.map((stack) => (
            <TechBadge key={stack} stackKey={stack} />
          ))}
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400">모집 인원: {post.recruitment_count}명</p>
      </article>

      {/* 지원 폼 */}
      <section className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">지원하기</h2>

        {submitted ? (
          <div className="rounded-lg border border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/30 px-4 py-6 text-center">
            <p className="text-base font-semibold text-green-700 dark:text-green-400 mb-1">
              ✅ 지원이 완료되었습니다!
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              결과는 알림을 통해 안내드립니다.
            </p>
          </div>
        ) : (
          <form onSubmit={handleApply} className="space-y-4">
            {post.custom_questions.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">추가 질문이 없습니다.</p>
            ) : (
              post.custom_questions.map((question, index) => (
                <div key={index}>
                  <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Q{index + 1}. {question} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={answers[question] ?? ''}
                    onChange={(e) => updateAnswer(question, e.target.value)}
                    rows={3}
                    placeholder="답변을 입력해주세요."
                    className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              ))
            )}

            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
            >
              {submitting ? '제출 중...' : '지원 제출'}
            </button>
          </form>
        )}
      </section>
    </div>
  )
}
