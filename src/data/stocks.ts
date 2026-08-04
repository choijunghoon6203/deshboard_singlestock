import type { CategoryId, Judgement, Metric, MetricKind, Stock } from '../types'

/**
 * ⚠️ 전부 목업(가상) 데이터입니다.
 * 실재하는 상장사의 재무정보가 아니며, 종목코드도 KRX에 존재하지 않는 가상의 값입니다.
 * 실제 연동 시 이 파일을 OpenDART / 시세 API 응답을 매핑한 어댑터로 교체하면 됩니다.
 */

interface MetricSeed {
  id: string
  label: string
  display: string
  criterion: string
  source: string
  percentile: number
  judgement: Judgement
  kind?: MetricKind
}

function build(category: CategoryId, seeds: MetricSeed[]): Metric[] {
  return seeds.map((s) => ({
    ...s,
    category,
    kind: s.kind ?? 'quant',
    // 4장: 업종 내 백분위를 그대로 0~100점으로 환산
    score: s.percentile,
  }))
}

const SAMPLE_ELEC: Stock = {
  ticker: '000000',
  name: '샘플전자',
  market: '코스피',
  sector: '반도체 · IT',
  price: 68_500,
  changePct: -2.4,
  intrinsicValue: 94_200,
  marketCap: 412.6,
  financialsAsOf: '2026-05-15 · 2026년 1분기 보고서',
  priceAsOf: '2026-08-04 15:30 KST',
  qualitativeTags: ['국내 1위 · 글로벌 3위', '설비 진입장벽 높음', '특허 1,240건', '주주환원 정책 명문화'],
  metrics: [
    ...build('profitability', [
      { id: 'roe', label: 'ROE (자기자본이익률)', display: '18.4% (5년 평균)', criterion: '5년 평균 15% 이상 선호', source: 'DART 재무제표', percentile: 88, judgement: 'pass' },
      { id: 'roic', label: 'ROIC', display: '14.2%', criterion: '투하자본 대비 수익성', source: 'DART 재무제표', percentile: 82, judgement: 'pass' },
      { id: 'op_margin', label: '영업이익률', display: '21.6%', criterion: '업종 평균 대비 우위 여부', source: 'DART 재무제표', percentile: 79, judgement: 'pass' },
      { id: 'net_margin_trend', label: '순이익률 추이', display: '표준편차 1.8%p (10년)', criterion: '변동성이 낮고 안정적 추세', source: 'DART 재무제표', percentile: 71, judgement: 'pass' },
    ]),
    ...build('stability', [
      { id: 'debt_ratio', label: '부채비율', display: '32.5%', criterion: '50% 이하 선호 (업종별 조정)', source: 'DART 재무제표', percentile: 84, judgement: 'pass' },
      { id: 'current_ratio', label: '유동비율', display: '218%', criterion: '단기 지급능력, 150% 이상 선호', source: 'DART 재무제표', percentile: 80, judgement: 'pass' },
      { id: 'interest_cover', label: '이자보상배수', display: '22.4배', criterion: '5배 이상 시 재무 여력 양호', source: 'DART 재무제표', percentile: 91, judgement: 'pass' },
    ]),
    ...build('growth', [
      { id: 'growth_cagr', label: '매출 · EPS 성장률 (5년)', display: '매출 +7.2% · EPS +9.8%', criterion: '완만하고 꾸준한 성장 선호', source: 'DART, 증권사 컨센서스', percentile: 68, judgement: 'pass' },
      { id: 'earnings_consistency', label: '이익 일관성', display: '최근 10년 적자 0회', criterion: '최근 10년 중 적자 연도 최소화', source: 'DART 재무제표 (연간)', percentile: 95, judgement: 'pass' },
    ]),
    ...build('valuation', [
      { id: 'per_pbr', label: 'PER / PBR', display: 'PER 11.4배 · PBR 1.18배', criterion: '업종 평균 · 역사적 밴드 대비 저평가', source: '시세 API + 재무데이터', percentile: 74, judgement: 'pass' },
      { id: 'peg', label: 'PEG', display: '0.86', criterion: '성장 대비 저평가 여부 (1 이하 선호)', source: '계산 지표', percentile: 77, judgement: 'pass' },
      { id: 'fcf_yield', label: 'FCF Yield', display: '6.4%', criterion: '시가총액 대비 잉여현금흐름 비율', source: '계산 지표', percentile: 81, judgement: 'pass' },
      { id: 'margin_of_safety', label: '안전마진 (DCF 내재가치 대비)', display: '27.3% 할인', criterion: '내재가치 대비 현재가 할인율', source: '자체 DCF 모델', percentile: 72, judgement: 'pass' },
    ]),
    ...build('cashflow', [
      { id: 'fcf', label: '잉여현금흐름 (FCF)', display: '8.9조원 · 10년 연속 (+)', criterion: '꾸준한 플러스(+) 창출', source: 'DART 현금흐름표', percentile: 86, judgement: 'pass' },
      { id: 'fcf_margin', label: 'FCF 마진', display: '12.7%', criterion: '매출 대비 현금창출 효율', source: '계산 지표', percentile: 73, judgement: 'pass' },
      { id: 'cash_conversion', label: '영업이익 대비 현금전환율', display: '108%', criterion: '회계이익의 질 (현금화 정도) 검증', source: '계산 지표', percentile: 83, judgement: 'pass' },
    ]),
    ...build('moat', [
      { id: 'gross_margin_stability', label: '매출총이익률 장기 안정성', display: '표준편차 2.4%p (10년)', criterion: '장기간 변동성이 낮을수록 해자 강함', source: 'DART 재무제표 (10년)', percentile: 76, judgement: 'pass' },
      { id: 'market_position', label: '시장점유율 / 업종 지위', display: '국내 1위 · 글로벌 3위', criterion: '정성 태그 (1~2위, 독점적 지위 등)', source: '업종 리포트, 수기 태깅', percentile: 85, judgement: 'pass', kind: 'qualitative' },
      { id: 'entry_barrier', label: '진입장벽 / 특허', display: '특허 1,240건 · 설비 진입장벽 높음', criterion: '정성 태그', source: '사업보고서, 특허청 데이터', percentile: 78, judgement: 'pass', kind: 'qualitative' },
    ]),
    ...build('governance', [
      { id: 'payout_ratio', label: '배당성향', display: '28.4%', criterion: '이익 대비 합리적 배분 비율', source: 'DART 공시', percentile: 66, judgement: 'pass' },
      { id: 'buyback', label: '자사주매입 이력', display: '최근 5년 중 3회 · 누적 2.1조원', criterion: '주주환원 의지 판단 지표', source: 'DART 공시', percentile: 74, judgement: 'pass', kind: 'qualitative' },
      { id: 'retained_efficiency', label: 'ROE 재투자 효율', display: '유보이익 1원당 시총 +1.4원', criterion: '유보이익 대비 시가총액 증가분', source: '계산 지표 (장기 시계열)', percentile: 69, judgement: 'pass' },
      { id: 'dividend_yield', label: '배당수익률', display: '2.3%', criterion: '과도하지 않은 안정적 수준', source: '시세 API', percentile: 58, judgement: 'watch' },
      { id: 'dividend_growth_years', label: '연속 배당성장 연수', display: '7년', criterion: '장기 우량주 판별에 유용', source: 'DART 공시 (장기 시계열)', percentile: 64, judgement: 'pass' },
    ]),
  ],
  history: [
    { year: 2016, roe: 14.2, revenue: 42.3, eps: 3210, fcf: 4.1, grossMargin: 37.8 },
    { year: 2017, roe: 16.8, revenue: 47.1, eps: 3980, fcf: 5.4, grossMargin: 39.6 },
    { year: 2018, roe: 19.1, revenue: 52.4, eps: 4720, fcf: 6.8, grossMargin: 41.2 },
    { year: 2019, roe: 13.6, revenue: 48.9, eps: 3540, fcf: 4.9, grossMargin: 38.1 },
    { year: 2020, roe: 15.2, revenue: 51.8, eps: 4110, fcf: 6.2, grossMargin: 39.4 },
    { year: 2021, roe: 18.7, revenue: 58.2, eps: 5240, fcf: 7.9, grossMargin: 41.8 },
    { year: 2022, roe: 20.3, revenue: 63.5, eps: 5980, fcf: 8.4, grossMargin: 42.3 },
    { year: 2023, roe: 12.9, revenue: 55.7, eps: 3860, fcf: 5.1, grossMargin: 37.2 },
    { year: 2024, roe: 17.4, revenue: 62.1, eps: 5410, fcf: 7.6, grossMargin: 40.5 },
    { year: 2025, roe: 18.9, revenue: 68.4, eps: 6120, fcf: 8.9, grossMargin: 41.1 },
  ],
  horizons: [
    {
      id: 'short',
      label: '단기',
      window: '2주 ~ 1개월',
      lens: '진입 타이밍 관점',
      matched: true,
      reasons: [
        '버핏 스코어 A등급 — B등급 이상 조건 충족',
        '최근 1개월 -11.4% 조정으로 안전마진이 27.3%까지 확대',
        'RSI 28.6 — 기술적 과매도 구간 (보조 표기)',
        '2026년 2분기 실적 발표 D-6 — 어닝 서프라이즈 모니터링 대상',
      ],
    },
    {
      id: 'mid',
      label: '중기',
      window: '2 ~ 3개월',
      lens: '펀더멘털 모멘텀 관점',
      matched: false,
      reasons: [
        '버핏 스코어 A등급 — 등급 조건은 충족',
        '최근 분기 영업이익이 컨센서스를 +2.1% 상회',
        '최근 2개 분기 연속 이익 개선 조건 미충족 — 직전 분기 영업이익 전분기 대비 -4.2%',
      ],
    },
    {
      id: 'long',
      label: '장기',
      window: '6개월 ~ 수년',
      lens: '핵심 보유 후보',
      matched: true,
      reasons: [
        '버핏 스코어 A등급 + 해자 정성 태그 상위 (국내 1위 · 글로벌 3위)',
        '최근 10년 적자 0회 — 이익 일관성 조건 충족',
        '연속 배당성장 7년 · 최근 5년 자사주매입 3회',
        '리스트 갱신 주기 분기 1회 — 다음 갱신 2026-10-01',
      ],
    },
  ],
}

const DAESUNG_MACHINE: Stock = {
  ticker: '000001',
  name: '대성기계',
  market: '코스피',
  sector: '기계 · 장비',
  price: 18_400,
  changePct: 0.8,
  intrinsicValue: 28_150,
  marketCap: 1.24,
  financialsAsOf: '2026-05-15 · 2026년 1분기 보고서',
  priceAsOf: '2026-08-04 15:30 KST',
  qualitativeTags: ['국내 4위 · 점유율 8%', '대체재 압력 존재', '특허 210건', '자사주매입 이력 없음'],
  metrics: [
    ...build('profitability', [
      { id: 'roe', label: 'ROE (자기자본이익률)', display: '8.6% (5년 평균)', criterion: '5년 평균 15% 이상 선호', source: 'DART 재무제표', percentile: 41, judgement: 'watch' },
      { id: 'roic', label: 'ROIC', display: '6.9%', criterion: '투하자본 대비 수익성', source: 'DART 재무제표', percentile: 38, judgement: 'watch' },
      { id: 'op_margin', label: '영업이익률', display: '7.2%', criterion: '업종 평균 대비 우위 여부', source: 'DART 재무제표', percentile: 46, judgement: 'watch' },
      { id: 'net_margin_trend', label: '순이익률 추이', display: '표준편차 4.9%p (10년)', criterion: '변동성이 낮고 안정적 추세', source: 'DART 재무제표', percentile: 33, judgement: 'fail' },
    ]),
    ...build('stability', [
      { id: 'debt_ratio', label: '부채비율', display: '88.4%', criterion: '50% 이하 선호 (업종별 조정)', source: 'DART 재무제표', percentile: 34, judgement: 'fail' },
      { id: 'current_ratio', label: '유동비율', display: '142%', criterion: '단기 지급능력, 150% 이상 선호', source: 'DART 재무제표', percentile: 47, judgement: 'watch' },
      { id: 'interest_cover', label: '이자보상배수', display: '4.2배', criterion: '5배 이상 시 재무 여력 양호', source: 'DART 재무제표', percentile: 39, judgement: 'watch' },
    ]),
    ...build('growth', [
      { id: 'growth_cagr', label: '매출 · EPS 성장률 (5년)', display: '매출 +3.1% · EPS +1.4%', criterion: '완만하고 꾸준한 성장 선호', source: 'DART, 증권사 컨센서스', percentile: 44, judgement: 'watch' },
      { id: 'earnings_consistency', label: '이익 일관성', display: '최근 10년 적자 2회 (2019 · 2023)', criterion: '최근 10년 중 적자 연도 최소화', source: 'DART 재무제표 (연간)', percentile: 36, judgement: 'fail' },
    ]),
    ...build('valuation', [
      { id: 'per_pbr', label: 'PER / PBR', display: 'PER 7.2배 · PBR 0.52배', criterion: '업종 평균 · 역사적 밴드 대비 저평가', source: '시세 API + 재무데이터', percentile: 88, judgement: 'pass' },
      { id: 'peg', label: 'PEG', display: '1.42', criterion: '성장 대비 저평가 여부 (1 이하 선호)', source: '계산 지표', percentile: 49, judgement: 'watch' },
      { id: 'fcf_yield', label: 'FCF Yield', display: '9.1%', criterion: '시가총액 대비 잉여현금흐름 비율', source: '계산 지표', percentile: 84, judgement: 'pass' },
      { id: 'margin_of_safety', label: '안전마진 (DCF 내재가치 대비)', display: '34.6% 할인', criterion: '내재가치 대비 현재가 할인율', source: '자체 DCF 모델', percentile: 79, judgement: 'pass' },
    ]),
    ...build('cashflow', [
      { id: 'fcf', label: '잉여현금흐름 (FCF)', display: '0.42조원 · 10년 중 8회 (+)', criterion: '꾸준한 플러스(+) 창출', source: 'DART 현금흐름표', percentile: 57, judgement: 'watch' },
      { id: 'fcf_margin', label: 'FCF 마진', display: '5.1%', criterion: '매출 대비 현금창출 효율', source: '계산 지표', percentile: 51, judgement: 'watch' },
      { id: 'cash_conversion', label: '영업이익 대비 현금전환율', display: '92%', criterion: '회계이익의 질 (현금화 정도) 검증', source: '계산 지표', percentile: 62, judgement: 'pass' },
    ]),
    ...build('moat', [
      { id: 'gross_margin_stability', label: '매출총이익률 장기 안정성', display: '표준편차 5.8%p (10년)', criterion: '장기간 변동성이 낮을수록 해자 강함', source: 'DART 재무제표 (10년)', percentile: 38, judgement: 'fail' },
      { id: 'market_position', label: '시장점유율 / 업종 지위', display: '국내 4위 · 점유율 8%', criterion: '정성 태그 (1~2위, 독점적 지위 등)', source: '업종 리포트, 수기 태깅', percentile: 42, judgement: 'watch', kind: 'qualitative' },
      { id: 'entry_barrier', label: '진입장벽 / 특허', display: '특허 210건 · 대체재 압력 존재', criterion: '정성 태그', source: '사업보고서, 특허청 데이터', percentile: 40, judgement: 'watch', kind: 'qualitative' },
    ]),
    ...build('governance', [
      { id: 'payout_ratio', label: '배당성향', display: '41.2%', criterion: '이익 대비 합리적 배분 비율', source: 'DART 공시', percentile: 55, judgement: 'watch' },
      { id: 'buyback', label: '자사주매입 이력', display: '최근 5년 0회', criterion: '주주환원 의지 판단 지표', source: 'DART 공시', percentile: 22, judgement: 'fail', kind: 'qualitative' },
      { id: 'retained_efficiency', label: 'ROE 재투자 효율', display: '유보이익 1원당 시총 +0.4원', criterion: '유보이익 대비 시가총액 증가분', source: '계산 지표 (장기 시계열)', percentile: 31, judgement: 'fail' },
      { id: 'dividend_yield', label: '배당수익률', display: '4.8%', criterion: '과도하지 않은 안정적 수준', source: '시세 API', percentile: 61, judgement: 'watch' },
      { id: 'dividend_growth_years', label: '연속 배당성장 연수', display: '2년', criterion: '장기 우량주 판별에 유용', source: 'DART 공시 (장기 시계열)', percentile: 35, judgement: 'fail' },
    ]),
  ],
  history: [
    { year: 2016, roe: 9.8, revenue: 3.42, eps: 1180, fcf: 0.21, grossMargin: 22.4 },
    { year: 2017, roe: 11.2, revenue: 3.71, eps: 1390, fcf: 0.28, grossMargin: 24.1 },
    { year: 2018, roe: 7.4, revenue: 3.58, eps: 920, fcf: 0.14, grossMargin: 21.3 },
    { year: 2019, roe: -2.1, revenue: 3.12, eps: -260, fcf: -0.08, grossMargin: 17.9 },
    { year: 2020, roe: 4.6, revenue: 3.05, eps: 540, fcf: 0.11, grossMargin: 19.8 },
    { year: 2021, roe: 10.4, revenue: 3.66, eps: 1240, fcf: 0.33, grossMargin: 23.6 },
    { year: 2022, roe: 8.9, revenue: 3.94, eps: 1110, fcf: 0.29, grossMargin: 22.8 },
    { year: 2023, roe: -1.4, revenue: 3.48, eps: -170, fcf: -0.05, grossMargin: 18.2 },
    { year: 2024, roe: 6.2, revenue: 3.82, eps: 760, fcf: 0.24, grossMargin: 20.7 },
    { year: 2025, roe: 8.6, revenue: 4.01, eps: 1020, fcf: 0.42, grossMargin: 21.9 },
  ],
  horizons: [
    {
      id: 'short',
      label: '단기',
      window: '2주 ~ 1개월',
      lens: '진입 타이밍 관점',
      matched: false,
      reasons: [
        '버핏 스코어 C등급 — B등급 이상 조건 미충족',
        '안전마진은 34.6%로 크게 확대되었으나 등급 조건이 우선 적용됨',
        'RSI 41.2 — 과매도 구간 아님',
      ],
    },
    {
      id: 'mid',
      label: '중기',
      window: '2 ~ 3개월',
      lens: '펀더멘털 모멘텀 관점',
      matched: false,
      reasons: [
        '버핏 스코어 C등급 — A등급 이상 조건 미충족',
        '최근 2개 분기 연속 이익 개선은 충족 (영업이익 +18.4% → +9.6%)',
        'ROE 추세는 개선 중이나 등급 조건에서 탈락',
      ],
    },
    {
      id: 'long',
      label: '장기',
      window: '6개월 ~ 수년',
      lens: '핵심 보유 후보',
      matched: false,
      reasons: [
        '10년 중 적자 2회 (2019 · 2023) — 이익 일관성 조건 미충족',
        '해자 정성 태그 하위 (국내 4위 · 점유율 8%)',
        '연속 배당성장 2년 · 최근 5년 자사주매입 0회',
      ],
    },
  ],
}

export const STOCKS: Stock[] = [SAMPLE_ELEC, DAESUNG_MACHINE]
