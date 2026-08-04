import { useEffect, useState } from 'react'

/**
 * Recharts 는 SVG 속성에 hex 를 직접 받으므로, CSS 변수 대신 실제 값을 넘긴다.
 * 라이트/다크 두 세트 모두 dataviz 팔레트에서 각 배경면에 맞게 선택된 스텝이며,
 * validate_palette.js 6개 검사를 통과했다 (자동 반전이 아니다).
 */
export interface ChartTheme {
  mode: 'light' | 'dark'
  surface: string
  series1: string
  series2: string
  grid: string
  axis: string
  textMuted: string
  textPrimary: string
}

const LIGHT: ChartTheme = {
  mode: 'light',
  surface: '#fcfcfb',
  series1: '#2a78d6',
  series2: '#eb6834',
  grid: '#e1e0d9',
  axis: '#c3c2b7',
  textMuted: '#898781',
  textPrimary: '#0b0b0b',
}

const DARK: ChartTheme = {
  mode: 'dark',
  surface: '#1a1a19',
  series1: '#3987e5',
  series2: '#d95926',
  grid: '#2c2c2a',
  axis: '#383835',
  textMuted: '#898781',
  textPrimary: '#ffffff',
}

function resolve(): ChartTheme {
  const stamped = document.documentElement.getAttribute('data-theme')
  if (stamped === 'dark') return DARK
  if (stamped === 'light') return LIGHT
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK : LIGHT
}

export function useChartTheme(): ChartTheme {
  const [theme, setTheme] = useState<ChartTheme>(resolve)

  useEffect(() => {
    const update = () => setTheme(resolve())

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener('change', update)

    const observer = new MutationObserver(update)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    return () => {
      mq.removeEventListener('change', update)
      observer.disconnect()
    }
  }, [])

  return theme
}
