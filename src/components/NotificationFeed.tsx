import { useEffect, useState } from 'react'
import type { Notification } from '../types'
import { supabase } from '../lib/supabase'

interface NotificationFeedProps {
  initialNotifications: Notification[]
}

export function NotificationFeed({ initialNotifications }: NotificationFeedProps) {
  const [notifications, setNotifications] = useState(initialNotifications)

  useEffect(() => {
    if (!supabase) return
    const client = supabase

    // 한국어 주석: notifications 테이블 변경을 구독해 알림 피드를 실시간으로 갱신합니다.
    const channel = client
      .channel('realtime-notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications' }, (payload) => {
        setNotifications((prev) => [payload.new as Notification, ...prev])
      })
      .subscribe()

    return () => {
      client.removeChannel(channel)
    }
  }, [])

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold text-slate-900">실시간 알림</h2>
      <ul className="space-y-2">
        {notifications.map((notification) => (
          <li
            key={notification.id}
            className={`rounded-lg px-3 py-2 text-sm ${
              notification.is_read ? 'bg-slate-50 text-slate-600' : 'bg-blue-50 text-blue-800'
            }`}
          >
            {notification.message}
          </li>
        ))}
      </ul>
    </section>
  )
}
