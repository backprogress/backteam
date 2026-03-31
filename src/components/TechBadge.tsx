import { techStackOptions } from '../data/mockData'

interface TechBadgeProps {
  stackKey: string
}

export function TechBadge({ stackKey }: TechBadgeProps) {
  const stack = techStackOptions.find((item) => item.key === stackKey)

  if (!stack) return null

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
      <span aria-hidden="true">{stack.icon}</span>
      {stack.label}
    </span>
  )
}
