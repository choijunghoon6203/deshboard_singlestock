import type { Stock } from '../types'

interface Props {
  stocks: Stock[]
  selected: Stock
  onSelect: (ticker: string) => void
  theme: 'light' | 'dark'
  onToggleTheme: () => void
}

export function Header({ stocks, selected, onSelect, theme, onToggleTheme }: Props) {
  return (
    <header className="header">
      <div>
        <div className="header-brand">버핏 스코어 · 종목 상세</div>
        <div className="header-name">
          <h1>{selected.name}</h1>
          <span className="header-meta">
            {selected.ticker} · {selected.market} · {selected.sector}
          </span>
        </div>
        {/*
          기획서 6장: 재무데이터 공시일과 시세 갱신시각을 반드시 구분해 표기.
          두 값의 시차가 스코어 신선도 저하의 원인이므로 상단에 고정 노출한다.
        */}
        <dl className="asof" style={{ marginTop: 10 }}>
          <div className="asof-row">
            <dt>재무데이터 기준</dt>
            <dd>{selected.financialsAsOf}</dd>
          </div>
          <div className="asof-row">
            <dt>시세 갱신</dt>
            <dd>{selected.priceAsOf}</dd>
          </div>
        </dl>
      </div>

      <div className="controls">
        <label className="header-meta" htmlFor="stock-select">
          종목
        </label>
        <select id="stock-select" value={selected.ticker} onChange={(e) => onSelect(e.target.value)}>
          {stocks.map((s) => (
            <option key={s.ticker} value={s.ticker}>
              {s.name} ({s.ticker})
            </option>
          ))}
        </select>
        <button className="ghost-btn" onClick={onToggleTheme} aria-label="라이트/다크 모드 전환">
          {theme === 'dark' ? '라이트 모드' : '다크 모드'}
        </button>
      </div>
    </header>
  )
}
