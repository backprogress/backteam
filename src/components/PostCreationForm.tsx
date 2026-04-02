import { useState } from 'react'
import { techStackOptions } from '../data/mockData'

export function PostCreationForm() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [questions, setQuestions] = useState<string[]>([''])
  const [selectedTech, setSelectedTech] = useState<string[]>([])

  const toggleTech = (key: string) => {
    setSelectedTech((prev) => (prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]))
  }

  const updateQuestion = (index: number, value: string) => {
    setQuestions((prev) => prev.map((question, questionIndex) => (questionIndex === index ? value : question)))
  }

  return (
    <section className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">공고 작성</h2>
      <div className="space-y-3">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="공고 제목"
          className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
        />
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="공고 설명"
          className="h-24 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
        />

        <div>
          <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">기술 스택 배지 선택</p>
          <div className="flex flex-wrap gap-2">
            {techStackOptions.map((stack) => (
              <button
                key={stack.key}
                type="button"
                onClick={() => toggleTech(stack.key)}
                className={`rounded-full border px-3 py-1 text-sm ${
                  selectedTech.includes(stack.key)
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400'
                    : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400'
                }`}
              >
                {stack.icon} {stack.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">커스텀 질문</p>
          <div className="space-y-2">
            {questions.map((question, index) => (
              <input
                key={index}
                value={question}
                onChange={(event) => updateQuestion(index, event.target.value)}
                placeholder={`질문 ${index + 1}`}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => setQuestions((prev) => [...prev, ''])}
            className="mt-2 text-sm font-medium text-blue-600 dark:text-blue-400"
          >
            + 질문 추가
          </button>
        </div>
      </div>
    </section>
  )
}
