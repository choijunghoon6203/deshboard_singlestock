import { GRADE_BANDS, marginOfSafety } from '../scoring'
import type { ScoreResult } from '../scoring'
import type { Stock } from '../types'

const won = (n: number) => n.toLocaleString('ko-KR') + '원'

interface Props {
  stock: Stock
  result: ScoreResult
}

export function ScoreHero({ stock, result }: Props) {
  const mos = marginOfSafety(stock)
  const up = stock.changePct >= 0

  return (
    <section className="card hero">
      <div>
        <div className="hero-label">버핏 스코어 (100점 만점)</div>
        <div>
          <span className="hero-figure">{result.total.toFixed(1)}</span>
          <span className="hero-unit">점</span>
        </div>
        <div className="grade-chip">
          <span className="grade-dot" aria-hidden="true" />
          {result.grade}등급
          <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>
            {GRADE_BANDS.find((b) => b.grade === result.grade)?.label}
          </span>
        </div>
      </div>

      <div className="hero-stats">
        <div>
          <div className="stat-label">현재가</div>
          <div className="stat-value">{won(stock.price)}</div>
          <div className={`stat-delta ${up ? 'delta-up' : 'delta-down'}`}>
            {up ? '▲' : '▼'} {Math.abs(stock.changePct).toFixed(1)}% 전일 대비
          </div>
        </div>
        <div>
          <div className="stat-label">DCF 내재가치</div>
          <div className="stat-value">{won(stock.intrinsicValue)}</div>
          <div className="stat-delta">자체 DCF 모델</div>
        </div>
        <div>
          <div className="stat-label">안전마진</div>
          <div className="stat-value">{(mos * 100).toFixed(1)}% 할인</div>
          <div className="stat-delta">내재가치 대비 현재가</div>
        </div>
        <div>
          <div className="stat-label">시가총액</div>
          <div className="stat-value">{stock.marketCap.toLocaleString('ko-KR')}조원</div>
          <div className="stat-delta">{stock.market}</div>
        </div>
      </div>

      {/* 등급 눈금자: 4장 등급 구간을 그대로 노출해 점수의 위치를 읽게 한다 */}
      <div className="grade-scale">
        <div className="grade-track">
          <div className="grade-fill" style={{ width: `${result.total}%` }} />
          {[40, 55, 70, 85].map((t) => (
            <div key={t} className="grade-marker" style={{ left: `${t}%` }} />
          ))}
        </div>
        <div className="grade-ticks">
          <span>D · 40점 미만</span>
          <span>C 40</span>
          <span>B 55</span>
          <span>A 70</span>
          <span>S 85 이상</span>
        </div>
      </div>
    </section>
  )
}
