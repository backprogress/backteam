import { useEffect, useMemo, useState } from 'react'
import { Routes, Route, Link, NavLink, useNavigate } from 'react-router-dom'
import type { Session } from '@supabase/supabase-js'
import { DarkModeProvider, useDarkMode } from './context/DarkModeContext'
import { FeedPage } from './pages/FeedPage'
import { PostDetailPage } from './pages/PostDetailPage'
import { CreatePostPage } from './pages/CreatePostPage'
import { ProfilePage } from './pages/ProfilePage'
import { NotificationsPage } from './pages/NotificationsPage'
import { TeacherPage } from './pages/TeacherPage'
import { OnboardingForm } from './components/OnboardingForm'
import { mockNotifications } from './data/mockData'
import {
  ensureProfileFromEmail,
  signInWithGoogle,
  signOut,
  updateOnboardingProfile,
} from './lib/auth'
import { supabase } from './lib/supabase'
import type { Profile } from './types'

// 다크모드 토글 버튼 컴포넌트
function DarkModeToggle() {
  const { darkMode, toggleDarkMode } = useDarkMode()
  return (
    <button
      type="button"
      onClick={toggleDarkMode}
      aria-label={darkMode ? '라이트 모드로 전환' : '다크 모드로 전환'}
      className="rounded-lg border border-slate-200 dark:border-slate-700 p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
    >
      {darkMode ? '☀️' : '🌙'}
    </button>
  )
}

interface HeaderProps {
  session: Session | null
  onLogin: () => void
  unreadCount: number
}

function Header({ session, onLogin, unreadCount }: HeaderProps) {
  const navigate = useNavigate()
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive
        ? 'text-blue-600 dark:text-blue-400'
        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
    }`

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        {/* 로고 */}
        <Link to="/" className="flex flex-col leading-tight">
          <span className="text-xs font-medium text-blue-600 dark:text-blue-400">역전파(Backpropagation)</span>
          <span className="text-lg font-bold text-slate-900 dark:text-slate-100">Backteam</span>
        </Link>

        {/* 중앙 네비게이션 (데스크톱) */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/" end className={navLinkClass}>공고 목록</NavLink>
          {session && (
            <NavLink to="/create" className={navLinkClass}>공고 작성</NavLink>
          )}
          {session && (
            <NavLink to="/notifications" className={({ isActive }) =>
              `relative text-sm font-medium transition-colors ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
              }`
            }>
              알림
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-3 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </NavLink>
          )}
          {session?.user.email?.startsWith('t') && (
            <NavLink to="/teacher" className={navLinkClass}>교사 대시보드</NavLink>
          )}
        </nav>

        {/* 우측 영역 */}
        <div className="flex items-center gap-2">
          <DarkModeToggle />
          {session ? (
            <>
              <button
                type="button"
                onClick={() => void navigate('/profile')}
                className="rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                title="내 프로필"
              >
                👤
              </button>
              <button
                type="button"
                onClick={() => void signOut()}
                className="rounded-lg border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                로그아웃
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onLogin}
              className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              Google 로그인
            </button>
          )}
        </div>
      </div>
    </header>
  )
}

function AppContent() {
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
          const loadedProfile = await ensureProfileFromEmail(
            data.session.user.id,
            data.session.user.email,
          )
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

  const unreadCount = mockNotifications.filter((n) => !n.is_read).length

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      <Header session={session} onLogin={() => void onLogin()} unreadCount={unreadCount} />

      <main className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        {isOnboardingRequired && session?.user.email ? (
          <div className="mb-6">
            <OnboardingForm email={session.user.email} onSubmit={onCompleteOnboarding} />
          </div>
        ) : null}

        {errorMessage ? (
          <p className="mb-4 rounded-lg border border-red-200 bg-red-50 dark:bg-red-900/30 dark:border-red-700 px-3 py-2 text-sm text-red-700 dark:text-red-400">
            {errorMessage}
          </p>
        ) : null}

        <Routes>
          <Route path="/" element={<FeedPage />} />
          <Route path="/posts/:id" element={<PostDetailPage />} />
          <Route path="/create" element={<CreatePostPage />} />
          <Route path="/profile" element={<ProfilePage session={session} profile={profile} onProfileUpdate={setProfile} />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/teacher" element={<TeacherPage />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <DarkModeProvider>
      <AppContent />
    </DarkModeProvider>
  )
}

export default App

