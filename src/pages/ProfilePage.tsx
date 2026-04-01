import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import { techStackOptions } from '../data/mockData'
import { TechBadge } from '../components/TechBadge'
import type { Profile } from '../types'

interface ProfilePageProps {
  session: Session | null
  profile: Profile | null
  onProfileUpdate?: (updated: Profile) => void
}

export function ProfilePage({ session, profile, onProfileUpdate }: ProfilePageProps) {
  const [editing, setEditing] = useState(false)
  const [techStacks, setTechStacks] = useState<string[]>(profile?.tech_stacks ?? [])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // 로그인하지 않은 경우 메인으로 리다이렉트
  if (!session) {
    return <Navigate to="/" replace />
  }

  const toggleTech = (key: string) => {
    setTechStacks((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    )
  }

  const handleSave = async () => {
    if (!profile) return
    setSaving(true)
    // 모의 저장 (Supabase 미연동 시 로컬 처리)
    await new Promise((resolve) => setTimeout(resolve, 500))
    onProfileUpdate?.({ ...profile, tech_stacks: techStacks })
    setSaving(false)
    setSaved(true)
    setEditing(false)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">내 프로필</h1>

      {saved && (
        <div className="rounded-lg border border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/30 px-4 py-3 text-sm text-green-700 dark:text-green-400">
          ✅ 프로필이 저장되었습니다.
        </div>
      )}

      {/* 기본 정보 */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xl font-bold">
            {profile?.name?.[0] ?? session.user.email?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              {profile?.name ?? '이름 미설정'}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{session.user.email}</p>
          </div>
        </div>

        {profile && (
          <dl className="grid grid-cols-2 gap-2 pt-2 text-sm">
            {profile.grade !== null && (
              <>
                <dt className="text-slate-500 dark:text-slate-400">학년</dt>
                <dd className="text-slate-900 dark:text-slate-100">{profile.grade}학년</dd>
              </>
            )}
            {profile.class !== null && (
              <>
                <dt className="text-slate-500 dark:text-slate-400">반</dt>
                <dd className="text-slate-900 dark:text-slate-100">{profile.class}반</dd>
              </>
            )}
            {profile.number !== null && (
              <>
                <dt className="text-slate-500 dark:text-slate-400">번호</dt>
                <dd className="text-slate-900 dark:text-slate-100">{profile.number}번</dd>
              </>
            )}
            {profile.phone && (
              <>
                <dt className="text-slate-500 dark:text-slate-400">전화번호</dt>
                <dd className="text-slate-900 dark:text-slate-100">{profile.phone}</dd>
              </>
            )}
            <dt className="text-slate-500 dark:text-slate-400">역할</dt>
            <dd className="text-slate-900 dark:text-slate-100">
              {profile.is_teacher ? '교사' : '학생'}
            </dd>
          </dl>
        )}
      </div>

      {/* 기술 스택 */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">기술 스택</h2>
          {!editing ? (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
            >
              편집
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditing(false)
                  setTechStacks(profile?.tech_stacks ?? [])
                }}
                className="text-sm text-slate-500 dark:text-slate-400 hover:underline"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={saving}
                className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-60"
              >
                {saving ? '저장 중...' : '저장'}
              </button>
            </div>
          )}
        </div>

        {editing ? (
          <div className="flex flex-wrap gap-2">
            {techStackOptions.map((stack) => (
              <button
                key={stack.key}
                type="button"
                onClick={() => toggleTech(stack.key)}
                className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                  techStacks.includes(stack.key)
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400'
                    : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-blue-400'
                }`}
              >
                {stack.icon} {stack.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {techStacks.length > 0 ? (
              techStacks.map((key) => <TechBadge key={key} stackKey={key} />)
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400">등록된 기술 스택이 없습니다.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
