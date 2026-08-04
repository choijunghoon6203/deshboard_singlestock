import { Fragment } from 'react'
import { JudgementBadge } from './Judgement'
import type { CategoryScore } from '../scoring'

/**
 * 기획서 3장의 24개 지표를 카테고리별로 그대로 노출한다.
 * 차트가 아니라 이 표가 값의 1차 출처 — 툴팁이 유일한 열람 경로가 되지 않게 한다.
 */
export function MetricTable({ categories }: { categories: CategoryScore[] }) {
  const total = categories.reduce((n, c) => n + c.metrics.length, 0)

  return (
    <section className="card">
      <h3 className="card-title">지표 상세</h3>
      <p className="card-sub">
        8개 소분류 · 총 {total}개 지표. 백분위는 동일 업종 내 순위이며, 정성 지표는 반자동 태깅 결과입니다.
      </p>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col">지표</th>
              <th scope="col">현재값</th>
              <th scope="col">버핏 기준</th>
              <th scope="col" className="num">
                업종 내 위치
              </th>
              <th scope="col" className="num">
                점수
              </th>
              <th scope="col">판정</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <Fragment key={c.id}>
                <tr className="cat-head">
                  <td colSpan={6}>
                    {c.label} · 가중치 {(c.weight * 100).toFixed(0)}% · 카테고리 점수 {c.score.toFixed(1)}
                  </td>
                </tr>
                {c.metrics.map((m) => (
                  <tr key={`${c.id}-${m.id}`}>
                    <th scope="row" style={{ fontWeight: 500, color: 'var(--text-primary)', fontSize: 13 }}>
                      {m.label}
                      {m.kind === 'qualitative' && <span className="tag-qual">정성</span>}
                      <span className="metric-source">{m.source}</span>
                    </th>
                    <td>{m.display}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{m.criterion}</td>
                    <td className="num">상위 {100 - m.percentile}%</td>
                    <td className="num">{m.score}</td>
                    <td>
                      <JudgementBadge value={m.judgement} />
                    </td>
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
