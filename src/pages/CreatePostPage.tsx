import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { techStackOptions } from '../data/mockData'
import type { Post } from '../types'

interface CreatePostPageProps {
  onPostCreated?: (post: Post) => void
}

export function CreatePostPage({ onPostCreated }: CreatePostPageProps) {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [recruitmentCount, setRecruitmentCount] = useState(1)
  const [deadline, setDeadline] = useState('')
  const [questions, setQuestions] = useState<string[]>([''])
  const [selectedTech, setSelectedTech] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const toggleTech = (key: string) => {
    setSelectedTech((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key],
    )
  }

  const updateQuestion = (index: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? value : q)),
    )
  }

  const removeQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (!title.trim() || !content.trim() || !deadline) {
      setError('제목, 내용, 마감일을 모두 입력해주세요.')
      return
    }
    // 마감일이 오늘 이전이면 오류 처리
    if (new Date(deadline) < new Date(new Date().toDateString())) {
      setError('마감일은 오늘 이후로 설정해주세요.')
      return
    }
    if (selectedTech.length === 0) {
      setError('기술 스택을 하나 이상 선택해주세요.')
      return
    }

    setSubmitting(true)

    // 모의 공고 생성 (Supabase 미연동 시 로컬 처리)
    const newPost: Post = {
      id: `post-${Date.now()}`,
      author_id: 'current-user',
      title: title.trim(),
      content: content.trim(),
      recruitment_count: recruitmentCount,
      tech_required: selectedTech,
      custom_questions: questions.filter((q) => q.trim()),
      deadline,
      status: 'active',
    }

    await new Promise((resolve) => setTimeout(resolve, 500))

    onPostCreated?.(newPost)
    setSubmitting(false)
    setSuccess(true)

    setTimeout(() => {
      void navigate('/')
    }, 1500)
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-slate-900 dark:text-slate-100">공고 작성</h1>

      {success && (
        <div className="mb-4 rounded-lg border border-green-200 bg-green-50 dark:bg-green-900/30 dark:border-green-700 px-4 py-3 text-sm text-green-700 dark:text-green-400">
          ✅ 공고가 성공적으로 등록되었습니다! 잠시 후 목록으로 이동합니다.
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/30 dark:border-red-700 px-4 py-3 text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
        {/* 제목 */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-300">
            공고 제목 <span className="text-red-500">*</span>
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="예: 프론트엔드 개발자 모집"
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 내용 */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-300">
            공고 내용 <span className="text-red-500">*</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="팀원 모집 상세 내용을 입력하세요."
            rows={4}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        {/* 모집 인원 + 마감일 */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              모집 인원
            </label>
            <input
              type="number"
              min={1}
              max={20}
              value={recruitmentCount}
              onChange={(e) => setRecruitmentCount(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700 dark:text-slate-300">
              마감일 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* 기술 스택 */}
        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
            기술 스택 <span className="text-red-500">*</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {techStackOptions.map((stack) => (
              <button
                key={stack.key}
                type="button"
                onClick={() => toggleTech(stack.key)}
                className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                  selectedTech.includes(stack.key)
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400'
                    : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-blue-400'
                }`}
              >
                {stack.icon} {stack.label}
              </button>
            ))}
          </div>
        </div>

        {/* 커스텀 질문 */}
        <div>
          <p className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-300">커스텀 질문</p>
          <div className="space-y-2">
            {questions.map((question, index) => (
              <div key={index} className="flex gap-2">
                <input
                  value={question}
                  onChange={(e) => updateQuestion(index, e.target.value)}
                  placeholder={`질문 ${index + 1}`}
                  className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeQuestion(index)}
                    className="rounded-lg border border-red-200 dark:border-red-700 px-2 py-1 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    삭제
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setQuestions((prev) => [...prev, ''])}
            className="mt-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            + 질문 추가
          </button>
        </div>

        {/* 제출 버튼 */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => void navigate('/')}
            className="flex-1 rounded-lg border border-slate-300 dark:border-slate-600 px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={submitting || success}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 transition-colors"
          >
            {submitting ? '등록 중...' : '공고 등록'}
          </button>
        </div>
      </form>
    </div>
  )
}
