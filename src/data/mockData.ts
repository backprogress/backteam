import type { Notification, Post, Profile } from '../types'

export const techStackOptions = [
  { key: 'react', label: 'React', icon: '⚛️' },
  { key: 'typescript', label: 'TypeScript', icon: '📘' },
  { key: 'supabase', label: 'Supabase', icon: '🟢' },
  { key: 'tailwind', label: 'Tailwind', icon: '🎨' },
  { key: 'figma', label: 'Figma', icon: '🧩' },
]

export const mockPosts: Post[] = [
  {
    id: 'post-1',
    author_id: 'teacher-1',
    title: '동아리 팀 빌딩 플랫폼 프론트엔드 개발자 모집',
    content: '메인 피드와 지원서 화면을 함께 구현할 팀원을 찾습니다.',
    recruitment_count: 3,
    tech_required: ['react', 'typescript', 'tailwind'],
    custom_questions: ['React 프로젝트 경험을 알려주세요.'],
    deadline: '2026-04-07',
    status: 'active',
  },
  {
    id: 'post-2',
    author_id: 'student-1',
    title: 'Supabase 연동 담당 모집',
    content: '인증/알림/권한 관리를 같이 설계할 백엔드 담당을 찾습니다.',
    recruitment_count: 2,
    tech_required: ['supabase', 'typescript'],
    custom_questions: ['실시간 기능 구현 경험이 있나요?'],
    deadline: '2026-04-03',
    status: 'active',
  },
  {
    id: 'post-3',
    author_id: 'student-2',
    title: 'UI/UX 디자인 파트너 모집',
    content: '잡코리아 스타일의 카드형 UI를 같이 다듬어 주실 분을 구합니다.',
    recruitment_count: 1,
    tech_required: ['figma', 'tailwind'],
    custom_questions: ['포트폴리오 링크를 첨부해주세요.'],
    deadline: '2026-04-15',
    status: 'active',
  },
]

export const mockNotifications: Notification[] = [
  {
    id: 'noti-1',
    user_id: 'student-1',
    message: '새 지원이 도착했습니다: 프론트엔드 개발자 모집',
    is_read: false,
    link: '/posts/post-1',
  },
  {
    id: 'noti-2',
    user_id: 'student-2',
    message: '지원 결과가 업데이트되었습니다. (합격)',
    is_read: true,
    link: '/applications/me',
  },
]

export const mockProfiles: Profile[] = [
  {
    id: 'student-1',
    name: '김학생',
    phone: '010-1234-5678',
    email: '26s20200@jh.ms.kr',
    grade: 2,
    class: 2,
    number: 0,
    is_teacher: false,
    tech_stacks: ['react', 'typescript'],
  },
  {
    id: 'student-2',
    name: '이학생',
    phone: '010-2222-3333',
    email: '25s30105@jh.ms.kr',
    grade: 3,
    class: 1,
    number: 5,
    is_teacher: false,
    tech_stacks: ['figma', 'tailwind'],
  },
  {
    id: 'teacher-1',
    name: '박교사',
    phone: '010-9999-0000',
    email: 't24s10101@jh.ms.kr',
    grade: null,
    class: null,
    number: null,
    is_teacher: true,
    tech_stacks: ['supabase'],
  },
]
