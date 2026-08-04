import { useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { TooltipProps } from 'recharts'
import type { YearPoint } from '../types'
import { useChartTheme } from '../useChartTheme'
import type { ChartTheme } from '../useChartTheme'

type SeriesKey = 'roe' | 'revenue' | 'eps' | 'fcf' | 'grossMargin'

interface SeriesDef {
  key: SeriesKey
  title: string
  sub: string
  unit: string
  format: (v: number) => string
  form: 'line' | 'column'
}

const SERIES: SeriesDef[] = [
  {
    key: 'roe',
    title: 'ROE 추이',
    sub: '자기자본이익률 · 버핏 기준 15% 이상',
    unit: '%',
    format: (v) => `${v.toFixed(1)}%`,
    form: 'line',
  },
  {
    key: 'revenue',
    title: '매출액 추이',
    sub: '연결 기준 · 완만하고 꾸준한 성장 선호',
    unit: '조원',
    format: (v) => `${v.toFixed(1)}조`,
    form: 'column',
  },
  {
    key: 'eps',
    title: 'EPS 추이',
    sub: '주당순이익 · 적자 연도 발생 여부 확인',
    unit: '원',
    format: (v) => `${v.toLocaleString('ko-KR')}원`,
    form: 'line',
  },
  {
    key: 'fcf',
    title: '잉여현금흐름(FCF) 추이',
    sub: '꾸준한 플러스(+) 창출 여부',
    unit: '조원',
    format: (v) => `${v.toFixed(2)}조`,
    form: 'line',
  },
]

function TrendTooltip({ active, payload, label, def }: TooltipProps<number, string> & { def: SeriesDef }) {
  if (!active || !payload?.length) return null
  const v = payload[0].value as number
  return (
    <div className="tooltip">
      <div className="tooltip-title">{label}년</div>
      <div className="tooltip-row">
        <span className="legend-swatch" style={{ background: 'var(--series-1)' }} />
        {def.title.replace(' 추이', '')}
        <span className="tooltip-value">{def.format(v)}</span>
      </div>
    </div>
  )
}

/** 마지막 지점에만 값을 붙인다 — 모든 점에 숫자를 찍지 않는다. */
function endLabel(def: SeriesDef, t: ChartTheme, lastYear: number) {
  return (props: {
    x?: number | string
    y?: number | string
    value?: number | string
    index?: number
    payload?: YearPoint
  }) => {
    const { x, y, value, payload } = props
    // Recharts 의 label 렌더러는 항상 SVG 엘리먼트를 요구하므로, 건너뛸 때는 빈 <g/>
    if (payload?.year !== lastYear || x == null || y == null || value == null) return <g />
    return (
      <text x={Number(x) + 8} y={Number(y)} dy={4} fill={t.textPrimary} fontSize={12} fontWeight={600}>
        {def.format(Number(value))}
      </text>
    )
  }
}

function TrendChart({ def, data }: { def: SeriesDef; data: YearPoint[] }) {
  const t = useChartTheme()
  const lastYear = data[data.length - 1].year
  const hasNegative = data.some((d) => (d[def.key] as number) < 0)

  const axes = (
    <>
      <CartesianGrid stroke={t.grid} strokeWidth={1} vertical={false} />
      <XAxis
        dataKey="year"
        tick={{ fill: t.textMuted, fontSize: 11 }}
        tickLine={false}
        axisLine={{ stroke: t.axis }}
        interval="preserveStartEnd"
        minTickGap={12}
      />
      <YAxis
        tick={{ fill: t.textMuted, fontSize: 11 }}
        tickLine={false}
        axisLine={false}
        width={48}
        tickFormatter={(v: number) => v.toLocaleString('ko-KR')}
      />
      <Tooltip
        cursor={{ stroke: t.axis, strokeWidth: 1 }}
        content={(props) => <TrendTooltip {...(props as TooltipProps<number, string>)} def={def} />}
      />
      {hasNegative && <ReferenceLine y={0} stroke={t.axis} strokeWidth={1} />}
    </>
  )

  return (
    <section className="card">
      <h3 className="card-title">
        {def.title} <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>({def.unit})</span>
      </h3>
      <p className="card-sub">{def.sub}</p>
      <div className="chart-box">
        <ResponsiveContainer width="100%" height="100%">
          {def.form === 'line' ? (
            <LineChart data={data} margin={{ top: 8, right: 56, bottom: 4, left: 0 }}>
              {axes}
              <Line
                type="monotone"
                dataKey={def.key}
                stroke={t.series1}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                dot={{ r: 4, fill: t.series1, stroke: t.surface, strokeWidth: 2 }}
                activeDot={{ r: 5, fill: t.series1, stroke: t.surface, strokeWidth: 2 }}
                label={endLabel(def, t, lastYear)}
                isAnimationActive={false}
              />
            </LineChart>
          ) : (
            <BarChart data={data} margin={{ top: 8, right: 56, bottom: 4, left: 0 }}>
              {axes}
              <Bar
                dataKey={def.key}
                fill={t.series1}
                maxBarSize={24}
                radius={[4, 4, 0, 0]}
                label={endLabel(def, t, lastYear)}
                isAnimationActive={false}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </section>
  )
}

function HistoryTable({ data }: { data: YearPoint[] }) {
  return (
    <section className="card">
      <h3 className="card-title">10년 추세 · 표로 보기</h3>
      <p className="card-sub">위 네 개 차트와 동일한 값입니다.</p>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col">연도</th>
              <th scope="col" className="num">
                ROE (%)
              </th>
              <th scope="col" className="num">
                매출액 (조원)
              </th>
              <th scope="col" className="num">
                EPS (원)
              </th>
              <th scope="col" className="num">
                FCF (조원)
              </th>
              <th scope="col" className="num">
                매출총이익률 (%)
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.year}>
                <th scope="row" style={{ fontWeight: 500, fontSize: 13 }}>
                  {d.year}
                </th>
                <td className="num">{d.roe.toFixed(1)}</td>
                <td className="num">{d.revenue.toFixed(2)}</td>
                <td className="num">{d.eps.toLocaleString('ko-KR')}</td>
                <td className="num">{d.fcf.toFixed(2)}</td>
                <td className="num">{d.grossMargin.toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export function TrendCharts({ data }: { data: YearPoint[] }) {
  const [showTable, setShowTable] = useState(false)

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
        <h2 className="section-title">10년 추세</h2>
        <button className="ghost-btn" onClick={() => setShowTable((v) => !v)} aria-expanded={showTable}>
          {showTable ? '차트만 보기' : '표로 보기'}
        </button>
      </div>
      <div className="grid grid-2">
        {SERIES.map((def) => (
          <TrendChart key={def.key} def={def} data={data} />
        ))}
      </div>
      {showTable && (
        <div style={{ marginTop: 16 }}>
          <HistoryTable data={data} />
        </div>
      )}
    </>
  )
}
