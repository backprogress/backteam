import { useEffect, useMemo, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { MainFeed } from './components/MainFeed'
import { NotificationFeed } from './components/NotificationFeed'
import { OnboardingForm } from './components/OnboardingForm'
import { PostCreationForm } from './components/PostCreationForm'
import { TeacherDashboard } from './components/TeacherDashboard'
import { mockNotifications, mockPosts, mockProfiles } from './data/mockData'
import {
  ensureProfileFromEmail,
  signInWithGoogle,
  signOut,
  updateOnboardingProfile,
} from './lib/auth'
import { supabase } from './lib/supabase'
import type { Profile } from './types'

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    if (!supabase) return
    const client = supabase

    const initializeSession = async () => {
      try {
        const { data } = await client.auth.getSession()
        setSession(data.session)
        if (data.session?.user.email) {
          const loadedProfile = await ensureProfileFromEmail(data.session.user.id, data.session.user.email)
          setProfile(loadedProfile)
        }
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : '세션 정보를 불러오지 못했습니다.')
      }
    }

    void initializeSession()

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
    })

    return () => subscription.unsubscribe()
  }, [])

  const isOnboardingRequired = useMemo(
    () => Boolean(session && (!profile?.name || !profile?.phone)),
    [profile, session],
  )

  const onLogin = async () => {
    setErrorMessage('')
    try {
      await signInWithGoogle()
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : '로그인에 실패했습니다.')
    }
  }

  const onCompleteOnboarding = async ({ name, phone }: { name: string; phone: string }) => {
    if (!session) return

    const updated = await updateOnboardingProfile(session.user.id, { name, phone })
    setProfile(updated)
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-4 md:px-6">
          <div>
            <p className="text-sm font-medium text-blue-700">역전파(Backpropagation)</p>
            <h1 className="text-xl font-bold">Backteam 팀 빌딩 플랫폼</h1>
          </div>
          <div className="flex gap-2">
            {session ? (
              <button
                type="button"
                onClick={() => void signOut()}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
              >
                로그아웃
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void onLogin()}
                className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white"
              >
                Google 로그인
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-4 px-4 py-6 md:grid-cols-[2fr_1fr] md:px-6">
        <section className="space-y-4">
          {isOnboardingRequired && session?.user.email ? (
            <OnboardingForm email={session.user.email} onSubmit={onCompleteOnboarding} />
          ) : null}

          {errorMessage ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {errorMessage}
            </p>
          ) : null}

          <MainFeed posts={mockPosts} />
          <PostCreationForm />
        </section>

        <aside className="space-y-4">
          <NotificationFeed initialNotifications={mockNotifications} />
          <TeacherDashboard posts={mockPosts} profiles={mockProfiles} />
        </aside>
      </main>
    </div>
  )
}

export default App
