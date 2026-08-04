import { JudgementBadge } from './Judgement'
import type { HorizonView, Stock } from '../types'

/**
 * 기획서 5장. 버핏 본인은 단기매매를 지향하지 않으므로, 기간별 관점은
 * '언제 사기 좋은가'가 아니라 '어떤 조건을 충족/미충족했는가'로 표시한다.
 * 조건 미충족 카드도 숨기지 않고 근거와 함께 노출한다.
 */
export function HorizonCards({ stock }: { stock: Stock }) {
  return (
    <>
      <h2 className="section-title">기간별 관점 · 조건 충족 여부</h2>
      <div className="grid grid-3">
        {stock.horizons.map((h: HorizonView) => (
          <section className="card horizon-card" key={h.id}>
            <div className="horizon-head">
              <h3 className="card-title">
                {h.label} · {h.lens}
              </h3>
              <span className="horizon-window">{h.window}</span>
            </div>
            <JudgementBadge value={h.matched ? 'pass' : 'watch'} label={h.matched ? '조건 충족' : '조건 미충족'} />
            <ul className="reasons">
              {h.reasons.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <div className="card" style={{ marginTop: 16 }}>
        <h3 className="card-title">해자 · 경영진 정성 태그</h3>
        <p className="card-sub">자동 크롤링 + 수기 검수를 병행한 반자동 태깅 결과입니다.</p>
        <div className="tags">
          {stock.qualitativeTags.map((t) => (
            <span className="tag" key={t}>
              {t}
            </span>
          ))}
        </div>
      </div>
    </>
  )
}
