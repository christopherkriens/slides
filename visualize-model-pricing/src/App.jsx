import { useState, useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer,
  ScatterChart, Scatter, ReferenceArea,
} from 'recharts'
import { MODELS, PROVIDERS, PROVIDER_COLORS } from './data/models.js'

const SOURCE_URL = 'https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing'

const METRICS = [
  { key: 'output',      label: 'Output' },
  { key: 'input',       label: 'Input' },
  { key: 'cachedInput', label: 'Cached input' },
]

const CAP_TIERS = [
  { tier: 1, label: 'Entry',    desc: 'Fast, cheap, simple tasks' },
  { tier: 2, label: 'Balanced', desc: 'Good performance / cost' },
  { tier: 3, label: 'Capable',  desc: 'Complex tasks' },
  { tier: 4, label: 'Frontier', desc: 'Maximum capability' },
]

const color = (provider) => PROVIDER_COLORS[provider] ?? '#64748b'

const perM = (n) => (n == null ? '-' : `$${n.toFixed(n < 1 ? 3 : 2)}`)

// ── Tooltips ─────────────────────────────────────────────────────────────────

function BarTooltip({ active, payload, metricLabel }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="tip">
      <p className="tip-title" style={{ color: color(d.provider) }}>{d.displayName}</p>
      <p>{d.provider}</p>
      <p>{metricLabel}: ${d._value.toFixed(2)}/1M tokens</p>
    </div>
  )
}

function ValueTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  if (!d) return null
  return (
    <div className="tip">
      <p className="tip-title" style={{ color: color(d.provider) }}>{d.displayName}</p>
      <p>{d.provider}</p>
      <p>SWE-bench Verified: {d.sweBench}%</p>
      <p>Output: ${d.output.toFixed(2)} · Input: ${d.input.toFixed(2)} /1M</p>
    </div>
  )
}

function NumberedDot({ cx, cy, payload }) {
  if (cx == null || cy == null || !payload) return null
  return (
    <g>
      <circle cx={cx} cy={cy} r={11} fill={color(payload.provider)} fillOpacity={0.92}
        stroke="#0b1120" strokeWidth={1.5} />
      <text x={cx} y={cy} dy="0.36em" textAnchor="middle" fontSize={11} fontWeight={700} fill="#0b1120">
        {payload._rank}
      </text>
    </g>
  )
}

function TierDot({ cx, cy, payload }) {
  if (cx == null || cy == null || !payload) return null
  return (
    <g>
      <circle cx={cx} cy={cy} r={9} fill={color(payload.provider)} fillOpacity={0.92}
        stroke="#0b1120" strokeWidth={1.5} />
      <text x={cx} y={cy} dy="0.36em" textAnchor="middle" fontSize={10} fontWeight={700} fill="#0b1120">
        {payload._rank}
      </text>
    </g>
  )
}

function TierTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  if (!d) return null
  const ct = CAP_TIERS.find(t => t.tier === d.capTier)
  return (
    <div className="tip">
      <p className="tip-title" style={{ color: color(d.provider) }}>{d.displayName}</p>
      <p>{d.provider}</p>
      <p>Tier {d.capTier}: {ct?.label}</p>
      <p>Output: ${d.output.toFixed(2)}/1M</p>
      {d.sweBench != null && <p>SWE-bench: {d.sweBench}%</p>}
    </div>
  )
}

// ── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [active, setActive] = useState(() => new Set(PROVIDERS))
  const [metric, setMetric] = useState('output')

  const toggleProvider = (p) =>
    setActive(prev => {
      const next = new Set(prev)
      next.has(p) ? next.delete(p) : next.add(p)
      return next.size ? next : prev // never empty
    })

  const models = useMemo(
    () => MODELS.filter(m => active.has(m.provider)),
    [active]
  )

  const metricLabel = METRICS.find(m => m.key === metric).label

  // Bar chart: data[0] renders at top in Recharts vertical layout, so sort
  // descending to place the most expensive model at the top.
  const barData = useMemo(
    () => models
      .map(m => ({ ...m, _value: m[metric] }))
      .sort((a, b) => b._value - a._value),
    [models, metric]
  )

  // Capability vs cost: only models with a SWE-bench score on the shared leaderboard.
  // Ranked by score (desc), then cheaper output first — drives the numbered markers + key.
  const scored = useMemo(() => models.filter(m => m.sweBench != null), [models])
  const scoredRanked = useMemo(
    () => [...scored]
      .sort((a, b) => b.sweBench - a.sweBench || a.output - b.output)
      .map((m, i) => ({ ...m, _rank: i + 1 })),
    [scored]
  )
  const unscoredCount = models.length - scored.length

  // Capability tier chart: tier = labeled horizontal lane (categorical),
  // output cost = x-axis (continuous). Within a lane, models sharing an exact
  // cost are dodged vertically — position inside a lane carries no meaning, so
  // this avoids occlusion without implying anything.
  const tierData = useMemo(() => {
    const groups = {}
    models
      .filter(m => m.id !== 'gpt-5-5-lc') // priced out of usable range; would flatten the scale
      .forEach(m => {
        if (!groups[m.capTier]) groups[m.capTier] = []
        groups[m.capTier].push(m)
      })
    const out = []
    Object.values(groups).forEach(g => {
      g.sort((a, b) => a.output - b.output)
      const byCost = {}
      g.forEach(m => { (byCost[m.output] ||= []).push(m) })
      g.forEach(m => {
        const peers = byCost[m.output]
        const i = peers.indexOf(m)
        const k = peers.length
        const offset = k > 1 ? (i - (k - 1) / 2) * 0.28 : 0
        out.push({ ...m, _y: m.capTier + offset })
      })
    })
    return out
      .sort((a, b) => b.capTier - a.capTier || a.output - b.output)
      .map((m, i) => ({ ...m, _rank: i + 1 }))
  }, [models])

  return (
    <div className="app">
      <header className="header">
        <h1>Copilot and Claude: Model Pricing</h1>
        <p>
          Compare token costs across every model on offer to choose the right one for your task. <a href={SOURCE_URL} target="_blank" rel="noreferrer">Source ↗</a>
        </p>
      </header>

      {/* ── Provider filter ── */}
      <div className="filter-bar">
        <span className="filter-label">Providers</span>
        {PROVIDERS.map(p => {
          const on = active.has(p)
          return (
            <button
              key={p}
              className={`chip ${on ? 'on' : ''}`}
              style={on ? { borderColor: color(p), background: color(p) + '22', color: color(p) } : undefined}
              onClick={() => toggleProvider(p)}
            >
              <span className="chip-dot" style={{ background: color(p) }} />
              {p}
            </button>
          )
        })}
      </div>

      {/* ── Cost comparison bar chart ── */}
      <section className="section">
        <div className="section-row">
          <h2>Cost per 1M Tokens</h2>
          <div className="segmented">
            {METRICS.map(m => (
              <button
                key={m.key}
                className={metric === m.key ? 'seg on' : 'seg'}
                onClick={() => setMetric(m.key)}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
        <p className="note">
          {metricLabel} price, {models.length} model{models.length !== 1 ? 's' : ''}, sorted high to low. Bars colored by provider.
        </p>
        <ResponsiveContainer width="100%" height={barData.length * 26 + 48}>
          <BarChart data={barData} layout="vertical" margin={{ top: 4, right: 56, left: 8, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
            <XAxis type="number" tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={v => `$${v}`} />
            <YAxis
              type="category" dataKey="name" width={118}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              interval={0}
            />
            <Tooltip content={<BarTooltip metricLabel={metricLabel} />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Bar dataKey="_value" radius={[0, 4, 4, 0]} isAnimationActive={false}
              label={{ position: 'right', fill: '#64748b', fontSize: 10, formatter: v => `$${v}` }}>
              {barData.map(m => <Cell key={m.id} fill={color(m.provider)} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* ── Capability tier vs cost ── */}
      <section className="section">
        <h2>Capability Tier vs Cost</h2>
        <p className="note">
          {tierData.length} models grouped into capability tiers (lanes), positioned by output price.
          Further left = cheaper. Tiers use each provider's own model family positioning, not a benchmark.
          GPT-5.5 (long context) is omitted: at $45/M it's priced out of usable range and would flatten the scale.
        </p>
        <ResponsiveContainer width="100%" height={440}>
          <ScatterChart margin={{ top: 16, right: 28, bottom: 40, left: 70 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical horizontal={false} />
            {CAP_TIERS.map(t => (
              <ReferenceArea
                key={t.tier} y1={t.tier - 0.5} y2={t.tier + 0.5}
                fill={t.tier % 2 ? 'rgba(255,255,255,0.035)' : 'rgba(255,255,255,0.08)'}
                stroke="none" ifOverflow="extendDomain"
              />
            ))}
            <XAxis
              type="number" dataKey="output" name="Output cost"
              domain={[0, 32]} ticks={[0, 5, 10, 15, 20, 25, 30]}
              tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={v => `$${v}`}
              label={{ value: 'Output $ / 1M tokens  (further left = cheaper) →', position: 'insideBottom', offset: -24, fill: '#475569', fontSize: 12 }}
            />
            <YAxis
              type="number" dataKey="_y"
              domain={[0.5, 4.5]} ticks={[1, 2, 3, 4]}
              tick={{ fill: '#94a3b8', fontSize: 12 }} tickLine={false} axisLine={false}
              tickFormatter={v => CAP_TIERS.find(t => t.tier === v)?.label ?? ''}
            />
            <Tooltip content={<TierTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#334155' }} />
            <Scatter data={tierData} shape={<TierDot />} isAnimationActive={false} />
          </ScatterChart>
        </ResponsiveContainer>

        <div style={{ marginTop: '1.25rem' }}>
          {[4, 3, 2, 1].map(t => {
            const ct = CAP_TIERS.find(c => c.tier === t)
            const tModels = tierData.filter(m => m.capTier === t)
            if (!tModels.length) return null
            return (
              <div key={t} className="tier-group">
                <p className="tier-heading">Tier {t} · {ct.label} <span>{ct.desc}</span></p>
                <div className="value-key">
                  {tModels.map(m => (
                    <div className="key-item" key={m.id}>
                      <span className="key-badge" style={{ background: color(m.provider) }}>{m._rank}</span>
                      <span className="key-name">{m.name}</span>
                      <span className="key-meta">${m.output}/M</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
        <p className="note" style={{ marginTop: '0.75rem', marginBottom: 0 }}>
          Tier placement uses each provider's own naming (Haiku/Sonnet/Opus, nano/mini/standard/frontier, Flash/Pro).
          Within a tier, models are numbered cheapest-first. Hover a dot for details.
        </p>
      </section>

      {/* ── Capability vs cost ── */}
      <section className="section">
        <h2>Capability vs Cost for Benchmarked Models</h2>
        <p className="note">
          SWE-bench Verified pass rate (x) against output price (y). Toward the bottom-right = more capable
          for less money. Markers are numbered (keyed below) and colored by provider. {scored.length} of {models.length}{' '}
          models have a comparable score; {unscoredCount} are omitted (see note below).
        </p>
        <ResponsiveContainer width="100%" height={440}>
          <ScatterChart margin={{ top: 16, right: 28, bottom: 48, left: 44 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis
              type="number" dataKey="sweBench" name="SWE-bench Verified"
              domain={[77.5, 83.2]} ticks={[78, 79, 80, 81, 82, 83]}
              tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={v => `${v}%`}
              label={{ value: 'SWE-bench Verified pass rate →', position: 'insideBottom', offset: -24, fill: '#475569', fontSize: 12 }}
            />
            <YAxis
              type="number" dataKey="output" name="Output cost"
              domain={[0, 50]} tickCount={6}
              tick={{ fill: '#64748b', fontSize: 11 }} tickFormatter={v => `$${v}`}
              label={{ value: '← cheaper   Output $ / 1M tokens', angle: -90, position: 'insideLeft', offset: 4, fill: '#475569', fontSize: 12 }}
            />
            <Tooltip content={<ValueTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#334155' }} />
            <Scatter data={scoredRanked} shape={<NumberedDot />} isAnimationActive={false} />
          </ScatterChart>
        </ResponsiveContainer>

        <div className="value-key">
          {scoredRanked.map(m => (
            <div className="key-item" key={m.id}>
              <span className="key-badge" style={{ background: color(m.provider) }}>{m._rank}</span>
              <span className="key-name">{m.name}</span>
              <span className="key-meta">{m.sweBench}% · ${m.output}/M</span>
            </div>
          ))}
        </div>
        <p className="note" style={{ marginTop: '0.5rem', marginBottom: 0 }}>
          Scores from the <a href="https://www.vals.ai/benchmarks/swebench" target="_blank" rel="noreferrer">vals.ai SWE-bench Verified leaderboard</a> (independent, consistent scaffold, updated 2026-06-04).
          Models without a score on that single leaderboard (including Opus 4.8, Sonnet 4.6, Haiku 4.5, and the smaller GPT/Gemini/GitHub SKUs)
          are left off rather than compared across mismatched scaffolds. SWE-bench numbers shift with the agent harness, so read this as a coarse tier, not a precise ranking.
        </p>
      </section>

<footer className="footer">
        <p>
          Data from <a href={SOURCE_URL} target="_blank" rel="noreferrer">GitHub Copilot billing docs</a> · pulled 2026-06-09 · 1 AI credit = $0.01 USD
        </p>
      </footer>
    </div>
  )
}
