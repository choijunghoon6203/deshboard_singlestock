import { SECTOR_BASELINE } from '../scoring'
import type { CategoryScore, ScoreResult } from '../scoring'

/**
 * 레이더 차트의 표(table view) 짝. 카테고리 점수 · 가중치 · 최종 기여분을
 * 숫자로 그대로 노출해, 버핏 스코어가 어떻게 합산되었는지 검산할 수 있게 한다.
 */
export function CategoryBreakdown({ result }: { result: ScoreResult }) {
  return (
    <section className="card">
      <h3 className="card-title">스코어 breakdown</h3>
      <p className="card-sub">카테고리 점수 × 가중치의 합 = 버핏 스코어 {result.total.toFixed(1)}점</p>

      <div className="legend">
        <span className="legend-item">
          <span className="legend-swatch" style={{ background: 'var(--series-1)' }} />
          카테고리 점수
        </span>
        <span className="legend-item">
          <span className="legend-rule" style={{ background: 'var(--axis)', height: 10, width: 2 }} />
          업종 평균 50점
        </span>
      </div>

      {result.categories.map((c: CategoryScore) => (
        <div className="breakdown-row" key={c.id}>
          <div>
            {/* 좁은 열이므로 레이더 축과 동일한 짧은 이름을 쓰고, 전체 명칭은 title 로 보존 */}
            <div className="breakdown-name" title={c.label}>
              {c.shortLabel}
            </div>
            <div className="breakdown-weight">가중치 {(c.weight * 100).toFixed(0)}%</div>
          </div>
          <div className="breakdown-track">
            <div className="breakdown-bar" style={{ width: `${c.score}%` }} />
            <div className="breakdown-baseline" style={{ left: `${SECTOR_BASELINE}%` }} />
          </div>
          <div>
            <div className="breakdown-value">{c.score.toFixed(1)}</div>
            <div className="breakdown-weight" style={{ textAlign: 'right' }}>
              +{c.contribution.toFixed(2)}
            </div>
          </div>
        </div>
      ))}
    </section>
  )
}
