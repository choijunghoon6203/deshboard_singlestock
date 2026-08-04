import type { Judgement } from '../types'

const SPEC: Record<Judgement, { label: string; color: string; path: string }> = {
  // 상태색은 반드시 아이콘 + 라벨과 함께 — 색 단독으로 의미를 전달하지 않는다.
  pass: { label: '기준 충족', color: 'var(--status-good)', path: 'M3.5 8.2l3 3 6-6.4' },
  watch: { label: '주의', color: 'var(--status-warning)', path: 'M8 3.6v5.2M8 11.6v.6' },
  fail: { label: '미달', color: 'var(--status-critical)', path: 'M4.6 4.6l6.8 6.8M11.4 4.6l-6.8 6.8' },
}

export function JudgementBadge({ value, label }: { value: Judgement; label?: string }) {
  const spec = SPEC[value]
  return (
    <span className="judge">
      <svg className="judge-icon" viewBox="0 0 16 16" aria-hidden="true">
        <circle cx="8" cy="8" r="7" fill="none" stroke={spec.color} strokeWidth="1.5" />
        <path d={spec.path} fill="none" stroke={spec.color} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      {label ?? spec.label}
    </span>
  )
}

export function judgementLabel(value: Judgement) {
  return SPEC[value].label
}
