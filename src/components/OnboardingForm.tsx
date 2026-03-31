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
    <form onSubmit={submit} className="rounded-xl border border-blue-200 bg-blue-50 p-5">
      <h2 className="mb-2 text-lg font-semibold text-slate-900">최초 로그인 프로필 설정</h2>
      <p className="mb-4 text-sm text-slate-600">{email} 계정으로 로그인되었습니다.</p>
      <div className="grid gap-3 md:grid-cols-2">
        <input
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="이름"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
        <input
          required
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
          placeholder="전화번호"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={saving}
        className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {saving ? '저장 중...' : '프로필 저장'}
      </button>
    </form>
  )
}
