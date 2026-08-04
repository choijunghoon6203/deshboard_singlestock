import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import type { TooltipProps } from 'recharts'
import { SECTOR_BASELINE } from '../scoring'
import type { CategoryScore } from '../scoring'
import { useChartTheme } from '../useChartTheme'

interface Props {
  categories: CategoryScore[]
}

function RadarTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload?.length) return null
  const score = payload.find((p) => p.dataKey === 'score')?.value as number | undefined
  return (
    <div className="tooltip">
      <div className="tooltip-title">{label}</div>
      <div className="tooltip-row">
        <span className="legend-swatch" style={{ background: 'var(--series-1)' }} />
        이 종목
        <span className="tooltip-value">{score?.toFixed(1)}점</span>
      </div>
      <div className="tooltip-row">
        <span className="legend-rule" style={{ background: 'var(--series-2)' }} />
        업종 평균
        <span className="tooltip-value">{SECTOR_BASELINE.toFixed(1)}점</span>
      </div>
    </div>
  )
}

export function CategoryRadar({ categories }: Props) {
  const t = useChartTheme()
  const data = categories.map((c) => ({
    shortLabel: c.shortLabel,
    score: Number(c.score.toFixed(1)),
    baseline: SECTOR_BASELINE,
  }))

  return (
    <section className="card">
      <h3 className="card-title">카테고리별 점수</h3>
      <p className="card-sub">업종 내 백분위를 0~100점으로 환산한 값. 업종 평균은 정의상 50점.</p>

      {/* 2개 계열 → 범례는 항상 노출 (색만으로 식별하지 않는다) */}
      <div className="legend">
        <span className="legend-item">
          <span className="legend-swatch" style={{ background: 'var(--series-1)' }} />
          이 종목
        </span>
        <span className="legend-item">
          <span className="legend-rule" style={{ background: 'var(--series-2)' }} />
          업종 평균 (50점)
        </span>
      </div>

      <div className="radar-box">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} outerRadius="72%">
            <PolarGrid stroke={t.grid} />
            <PolarAngleAxis dataKey="shortLabel" tick={{ fill: t.textMuted, fontSize: 11 }} />
            <PolarRadiusAxis
              domain={[0, 100]}
              tickCount={3}
              /* 축 라벨과 겹치지 않도록 스포크 사이(90 - 360/7/2)에 눈금을 둔다 */
              angle={64}
              tick={{ fill: t.textMuted, fontSize: 10 }}
              axisLine={false}
            />
            <Radar
              name="업종 평균"
              dataKey="baseline"
              stroke={t.series2}
              strokeWidth={2}
              fill="none"
              isAnimationActive={false}
            />
            <Radar
              name="이 종목"
              dataKey="score"
              stroke={t.series1}
              strokeWidth={2}
              fill={t.series1}
              fillOpacity={0.1}
              dot={{ r: 4, fill: t.series1, stroke: t.surface, strokeWidth: 2 }}
              isAnimationActive={false}
            />
            <Tooltip content={<RadarTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
