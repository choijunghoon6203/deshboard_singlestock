/**
 * 기획서 3장(평가 데이터 항목) · 4장(버핏 스코어) 을 타입으로 옮긴 것.
 * 카테고리는 3장의 8개 소분류를 4.1 가중치 테이블의 7개 버킷으로 합친다
 * (경영진/자본배분 + 배당 → governance 5%).
 */

export type CategoryId =
  | 'profitability'
  | 'stability'
  | 'growth'
  | 'valuation'
  | 'cashflow'
  | 'moat'
  | 'governance'

export interface CategoryDef {
  id: CategoryId
  /** 4.1 카테고리명 */
  label: string
  /** 레이더 축처럼 좁은 자리에 쓰는 짧은 이름 */
  shortLabel: string
  /** 가중치 (합 = 1) */
  weight: number
  /** 4.1 비고 */
  note: string
}

/** 4.1 카테고리별 가중치 — 합계 100% */
export const CATEGORIES: CategoryDef[] = [
  { id: 'valuation', label: '가치평가 / 안전마진', shortLabel: '가치평가', weight: 0.25, note: '버핏 철학 핵심, 최고 가중치' },
  { id: 'profitability', label: '수익성', shortLabel: '수익성', weight: 0.2, note: 'ROE·ROIC 중심' },
  { id: 'stability', label: '재무 안정성', shortLabel: '재무안정성', weight: 0.15, note: '부채비율·이자보상배수' },
  { id: 'cashflow', label: '현금흐름의 질', shortLabel: '현금흐름', weight: 0.15, note: 'FCF 지속성' },
  { id: 'growth', label: '성장성 / 이익 일관성', shortLabel: '성장성', weight: 0.1, note: '10년 적자 유무 감점 반영' },
  { id: 'moat', label: '경제적 해자', shortLabel: '해자', weight: 0.1, note: '정성 태그 포함, 가중치 제한적 반영' },
  { id: 'governance', label: '경영진 / 배당', shortLabel: '경영진·배당', weight: 0.05, note: '보조 지표' },
]

export const CATEGORY_BY_ID: Record<CategoryId, CategoryDef> = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
) as Record<CategoryId, CategoryDef>

/** 기준 충족 여부 판정. 색 단독으로 의미를 전달하지 않도록 항상 아이콘+텍스트와 함께 쓴다. */
export type Judgement = 'pass' | 'watch' | 'fail'

/** 정량 지표는 수치 기반, 정성 지표는 반자동 태깅(4장) */
export type MetricKind = 'quant' | 'qualitative'

export interface Metric {
  id: string
  label: string
  category: CategoryId
  /** 화면에 그대로 찍는 현재값 (단위 포함). 정성 지표는 태그 문자열 */
  display: string
  /** 3장의 '정의/버핏 기준' 열 */
  criterion: string
  /** 3장의 '데이터 소스' 열 */
  source: string
  /** 업종 내 백분위 (0~100). 4장 정규화 결과 */
  percentile: number
  /** 백분위를 0~100점으로 환산한 지표 점수 */
  score: number
  judgement: Judgement
  kind: MetricKind
}

export interface YearPoint {
  year: number
  /** 자기자본이익률 (%) */
  roe: number
  /** 매출액 (조원) */
  revenue: number
  /** 주당순이익 (원) */
  eps: number
  /** 잉여현금흐름 (조원) */
  fcf: number
  /** 매출총이익률 (%) — 해자 안정성 판단용 */
  grossMargin: number
}

/** 5장 기간별 관점. 각 카드는 산출 근거를 반드시 함께 노출한다. */
export type HorizonId = 'short' | 'mid' | 'long'

export interface HorizonView {
  id: HorizonId
  label: string
  /** '2주~1개월' 등 */
  window: string
  /** 관점 요약 — 5.1~5.3의 부제 */
  lens: string
  /** 조건 충족 여부 */
  matched: boolean
  /** 선정/제외 근거. 근거 없는 추천은 노출하지 않는다. */
  reasons: string[]
}

export interface Stock {
  ticker: string
  name: string
  market: '코스피' | '코스닥'
  sector: string
  /** 현재가 (원) */
  price: number
  /** 전일 대비 등락률 (%) */
  changePct: number
  /** 자체 DCF 내재가치 (원) — 3.4 안전마진 */
  intrinsicValue: number
  /** 시가총액 (조원) */
  marketCap: number
  /** 재무데이터 기준: 최근 반영 공시 */
  financialsAsOf: string
  /** 시세 갱신 시각 */
  priceAsOf: string
  metrics: Metric[]
  history: YearPoint[]
  horizons: HorizonView[]
  /** 해자·경영진 정성 태그 (4장 반자동 태깅 결과) */
  qualitativeTags: string[]
}
