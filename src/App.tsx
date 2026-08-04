import { useEffect, useMemo, useState } from 'react'
import { Header } from './components/Header'
import { ScoreHero } from './components/ScoreHero'
import { CategoryRadar } from './components/CategoryRadar'
import { CategoryBreakdown } from './components/CategoryBreakdown'
import { MetricTable } from './components/MetricTable'
import { TrendCharts } from './components/TrendCharts'
import { HorizonCards } from './components/HorizonCards'
import { Methodology } from './components/Methodology'
import { STOCKS } from './data/stocks'
import { scoreStock } from './scoring'

type ThemeChoice = 'light' | 'dark'

function initialTheme(): ThemeChoice {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export default function App() {
  const [ticker, setTicker] = useState(STOCKS[0].ticker)
  const [theme, setTheme] = useState<ThemeChoice>(initialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const stock = useMemo(() => STOCKS.find((s) => s.ticker === ticker) ?? STOCKS[0], [ticker])
  const result = useMemo(() => scoreStock(stock), [stock])

  return (
    <div className="app">
      <Header
        stocks={STOCKS}
        selected={stock}
        onSelect={setTicker}
        theme={theme}
        onToggleTheme={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      />

      {/* 8.2 — 모든 화면에 상시 노출되는 고지문 */}
      <div className="disclaimer" role="note">
        <span aria-hidden="true">⚠️</span>
        <span>
          <strong>투자자문이 아닙니다.</strong> 본 화면은 공개 데이터를 정량화해 보여주는 참고 정보이며, 특정 종목의 매수·
          매도를 권유하지 않습니다. 투자 판단과 그 결과에 대한 책임은 이용자 본인에게 있습니다. 또한 현재 표시되는 값은
          전부 <strong>가상의 목업 데이터</strong>로, 실재하는 상장사의 재무정보가 아닙니다.
        </span>
      </div>

      <h2 className="section-title">종합 평가</h2>
      <ScoreHero stock={stock} result={result} />

      <div className="grid grid-2" style={{ marginTop: 16 }}>
        <CategoryRadar categories={result.categories} />
        <CategoryBreakdown result={result} />
      </div>

      <div style={{ marginTop: 16 }}>
        <MetricTable categories={result.categories} />
      </div>

      <TrendCharts data={stock.history} />

      <HorizonCards stock={stock} />

      <Methodology />

      <footer>
        버핏 스코어 대시보드 프로토타입 · 기획서 v1.0 기준 · 데이터 출처: OpenDART, KRX, 증권사 Open API (현재 화면은
        목업 데이터)
      </footer>
    </div>
  )
}
