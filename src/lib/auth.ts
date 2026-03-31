import type { Profile } from '../types'
import { supabase } from './supabase'

const SCHOOL_DOMAIN = 'jh.ms.kr'

export function isAllowedSchoolEmail(email: string): boolean {
  return email.toLowerCase().endsWith(`@${SCHOOL_DOMAIN}`)
}

export function parseSchoolIdentity(email: string): {
  admissionYear: number
  grade: number
  class: number
  number: number
  isTeacher: boolean
} | null {
  const lowered = email.toLowerCase()
  if (!isAllowedSchoolEmail(lowered)) return null

  const localPart = lowered.split('@')[0]
  const isTeacher = localPart.startsWith('t')
  const normalized = isTeacher ? localPart.slice(1) : localPart
  const match = normalized.match(/^(\d{2})s(\d{5})$/)

  if (!match) return null

  const [grade, classNumber, ...numberDigits] = match[2].split('').map(Number)

  return {
    admissionYear: 2000 + Number(match[1]),
    grade,
    class: classNumber,
    number: Number(numberDigits.join('')),
    isTeacher,
  }
}

export async function signInWithGoogle() {
  if (!supabase) throw new Error('Supabase 설정이 필요합니다.')

  // 한국어 주석: Google OAuth 단계에서 학교 도메인으로 힌트를 주어 잘못된 계정 선택을 줄입니다.
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      queryParams: { hd: SCHOOL_DOMAIN },
    },
  })

  if (error) throw error
}

export async function signOut() {
  if (!supabase) return
  await supabase.auth.signOut()
}

export async function ensureProfileFromEmail(userId: string, email: string): Promise<Profile | null> {
  if (!supabase) return null

  if (!isAllowedSchoolEmail(email)) {
    await supabase.auth.signOut()
    throw new Error('jh.ms.kr 계정만 사용할 수 있습니다.')
  }

  const identity = parseSchoolIdentity(email)
  if (!identity) {
    throw new Error('이메일 형식이 올바르지 않습니다. (예: 26s20200@jh.ms.kr)')
  }

  const { data: existingProfile, error: profileReadError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle<Profile>()

  if (profileReadError) throw profileReadError

  if (existingProfile) return existingProfile

  // 한국어 주석: 최초 로그인 시 이름/전화번호를 비워 저장하고, 온보딩에서 필수 입력을 완료합니다.
  const { data: insertedProfile, error: insertError } = await supabase
    .from('profiles')
    .insert({
      id: userId,
      email,
      name: '',
      phone: '',
      grade: identity.isTeacher ? null : identity.grade,
      class: identity.isTeacher ? null : identity.class,
      number: identity.isTeacher ? null : identity.number,
      is_teacher: identity.isTeacher,
      tech_stacks: [],
    })
    .select('*')
    .single<Profile>()

  if (insertError) throw insertError

  return insertedProfile
}

export async function updateOnboardingProfile(userId: string, profile: Pick<Profile, 'name' | 'phone'>) {
  if (!supabase) throw new Error('Supabase 설정이 필요합니다.')

  const { data, error } = await supabase
    .from('profiles')
    .update({ name: profile.name, phone: profile.phone })
    .eq('id', userId)
    .select('*')
    .single<Profile>()

  if (error) throw error
  return data
}
