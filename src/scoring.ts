import { CATEGORIES, CATEGORY_BY_ID } from './types'
import type { CategoryId, Metric, Stock } from './types'

/** 4장 등급 구간: S(85↑) · A(70~84) · B(55~69) · C(40~54) · D(40 미만) */
export type Grade = 'S' | 'A' | 'B' | 'C' | 'D'

export const GRADE_BANDS: { grade: Grade; min: number; label: string }[] = [
  { grade: 'S', min: 85, label: '85점 이상' },
  { grade: 'A', min: 70, label: '70 ~ 84점' },
  { grade: 'B', min: 55, label: '55 ~ 69점' },
  { grade: 'C', min: 40, label: '40 ~ 54점' },
  { grade: 'D', min: 0, label: '40점 미만' },
]

export function gradeOf(score: number): Grade {
  return (GRADE_BANDS.find((b) => score >= b.min) ?? GRADE_BANDS[GRADE_BANDS.length - 1]).grade
}

export interface CategoryScore {
  id: CategoryId
  label: string
  shortLabel: string
  weight: number
  note: string
  /** 카테고리 내 지표 점수의 단순 평균 (0~100) */
  score: number
  /** 가중치를 곱한 최종 점수 기여분 */
  contribution: number
  metrics: Metric[]
}

export interface ScoreResult {
  total: number
  grade: Grade
  categories: CategoryScore[]
}

const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0)

/**
 * 카테고리 점수 = 소속 지표 점수의 단순 평균,
 * 버핏 스코어 = 카테고리 점수의 가중합 (4장).
 */
export function scoreStock(stock: Stock): ScoreResult {
  const categories: CategoryScore[] = CATEGORIES.map((def) => {
    const metrics = stock.metrics.filter((m) => m.category === def.id)
    const score = mean(metrics.map((m) => m.score))
    return {
      id: def.id,
      label: def.label,
      shortLabel: def.shortLabel,
      weight: def.weight,
      note: def.note,
      score,
      contribution: score * def.weight,
      metrics,
    }
  })

  const total = categories.reduce((sum, c) => sum + c.contribution, 0)
  return { total, grade: gradeOf(total), categories }
}

/** 업종 평균은 정의상 백분위 50 — 레이더의 비교 기준선으로 쓴다. */
export const SECTOR_BASELINE = 50

export function categoryLabel(id: CategoryId) {
  return CATEGORY_BY_ID[id].label
}

/** 안전마진 = (내재가치 - 현재가) / 내재가치 */
export function marginOfSafety(stock: Stock): number {
  return (stock.intrinsicValue - stock.price) / stock.intrinsicValue
}
