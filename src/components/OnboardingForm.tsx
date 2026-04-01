import { useState } from 'react'

interface OnboardingFormProps {
  email: string
  onSubmit: (payload: { name: string; phone: string }) => Promise<void>
}

export function OnboardingForm({ email, onSubmit }: OnboardingFormProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [saving, setSaving] = useState(false)

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    try {
      await onSubmit({ name, phone })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="rounded-xl border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 p-5">
      <h2 className="mb-2 text-lg font-semibold text-slate-900 dark:text-slate-100">최초 로그인 프로필 설정</h2>
      <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">{email} 계정으로 로그인되었습니다.</p>
      <div className="grid gap-3 md:grid-cols-2">
        <input
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="이름"
          className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
        />
        <input
          required
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="전화번호"
          className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500"
        />
      </div>
      <button
        type="submit"
        disabled={saving}
        className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60 hover:bg-blue-700 transition-colors"
      >
        {saving ? '저장 중...' : '프로필 저장'}
      </button>
    </form>
  )
}
