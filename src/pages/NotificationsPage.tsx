import { useState } from 'react'
import { mockNotifications } from '../data/mockData'
import type { Notification } from '../types'

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          알림
          {unreadCount > 0 && (
            <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-semibold text-white">
              {unreadCount}
            </span>
          )}
        </h1>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            모두 읽음 표시
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <p className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
          알림이 없습니다.
        </p>
      ) : (
        <ul className="space-y-2">
          {notifications.map((notification) => (
            <li
              key={notification.id}
              className={`flex items-start gap-3 rounded-xl border p-4 transition-colors ${
                notification.is_read
                  ? 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  : 'border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-100'
              }`}
            >
              <span className="mt-0.5 text-lg" aria-hidden="true">
                {notification.is_read ? '📭' : '📬'}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm">{notification.message}</p>
              </div>
              {!notification.is_read && (
                <button
                  type="button"
                  onClick={() => markAsRead(notification.id)}
                  className="shrink-0 rounded-lg border border-blue-300 dark:border-blue-600 px-2 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800/30"
                >
                  읽음
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
