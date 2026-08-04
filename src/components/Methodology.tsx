import { CATEGORIES } from '../types'
import { GRADE_BANDS } from '../scoring'

/** 기획서 6장 '방법론 페이지' — 산식과 출처를 투명하게 공개해 신뢰성을 확보한다. */
export function Methodology() {
  return (
    <>
      <h2 className="section-title">방법론</h2>
      <div className="grid grid-2">
        <section className="card">
          <h3 className="card-title">산식</h3>
          <p className="card-sub">지표 → 카테고리 → 종합 점수의 3단계</p>
          <ol className="method-list">
            <li>각 지표를 동일 업종 내 백분위(percentile)로 정규화한 뒤 0~100점으로 환산합니다.</li>
            <li>카테고리 점수 = 해당 카테고리에 속한 지표 점수의 단순 평균.</li>
            <li>버핏 스코어 = 카테고리 점수 × 가중치의 합계.</li>
            <li>정성 지표(해자 · 경영진 일부)는 자동 크롤링 + 수기 검수를 병행한 반자동 태깅으로 점수화합니다.</li>
          </ol>
        </section>

        <section className="card">
          <h3 className="card-title">가중치 및 등급 구간</h3>
          <p className="card-sub">가치평가/안전마진에 최고 가중치를 부여합니다.</p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th scope="col">카테고리</th>
                  <th scope="col" className="num">
                    가중치
                  </th>
                  <th scope="col">비고</th>
                </tr>
              </thead>
              <tbody>
                {CATEGORIES.map((c) => (
                  <tr key={c.id}>
                    <th scope="row" style={{ fontWeight: 500, fontSize: 13 }}>
                      {c.label}
                    </th>
                    <td className="num">{(c.weight * 100).toFixed(0)}%</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{c.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="card-sub" style={{ marginTop: 14, marginBottom: 0 }}>
            등급 구간 — {GRADE_BANDS.map((b) => `${b.grade}(${b.label})`).join(' · ')}
          </p>
        </section>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h3 className="card-title">데이터 출처 및 갱신 주기</h3>
        <ul className="method-list">
          <li>
            재무제표 · 공시: OpenDART(금융감독원 전자공시 Open API) — 분기 공시 시즌에 맞춰 배치 수집 후 스코어 재계산.
          </li>
          <li>시세: 국내 증권사 Open API(한국투자증권 KIS 등) 및 KRX 정보데이터시스템 — 일 단위 또는 짧은 주기로 갱신.</li>
          <li>컨센서스 · 업종 비교: 유료 데이터 벤더 연동 여부는 라이선스 확인 후 결정.</li>
          <li>
            PER · PBR · FCF Yield · 안전마진처럼 시세에 연동되는 지표는 시세 갱신 시 자동 재계산되며, 나머지 지표는 공시
            기준일 시점 값입니다.
          </li>
        </ul>
      </div>

      <h2 className="section-title">유의사항</h2>
      <div className="card">
        <ul className="method-list">
          <li>정량 스코어만으로는 버핏이 중시하는 정성적 판단(경영진 신뢰, 산업 이해도)을 완전히 대체할 수 없습니다.</li>
          <li>과거 재무데이터 기반 스코어링은 미래 성과를 보장하지 않으며, 백테스트를 통한 지속적 검증이 필요합니다.</li>
          <li>공시 데이터의 반영 시차로 스코어 신선도가 저하될 수 있어 화면 상단에 데이터 기준일을 명시합니다.</li>
          <li>가중치와 등급 구간은 기획서 v1.0의 예시값이며, 백테스트 결과에 따라 조정될 수 있습니다.</li>
        </ul>
      </div>
    </>
  )
}
