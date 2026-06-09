// Pricing source: GitHub Copilot — Models and pricing
//   https://docs.github.com/en/copilot/reference/copilot-billing/models-and-pricing
//   Pulled 2026-06-09. Prices are USD per 1M tokens. 1 AI credit = $0.01 USD.
//
// Capability source: vals.ai SWE-bench Verified leaderboard (independent, consistent
//   scaffold), updated 2026-06-04: https://www.vals.ai/benchmarks/swebench
//   `sweBench` = SWE-bench Verified pass-rate %. null = no comparable score on that
//   single leaderboard; such models are omitted from the capability chart rather than
//   scored against a different scaffold. Long-context variants inherit the base
//   model's score (same model, different pricing tier).
//
// `capTier` = provider capability tier (1=Entry, 2=Balanced, 3=Capable, 4=Frontier).
//   Based on each provider's own model family naming (Haiku/Sonnet/Opus,
//   nano/mini/standard/frontier, Flash/Pro). Not a benchmark.
//
// `tier` distinguishes default vs long-context pricing rows for models that have both.
// `cacheWrite` is null where the source does not list a separate cache-write charge.

export const MODELS = [
  // ── OpenAI ─────────────────────────────────────────────
  { id: 'gpt-5-mini',     name: 'GPT-5 mini',      displayName: 'GPT-5 mini',                provider: 'OpenAI',    input: 0.25,  cachedInput: 0.025, output: 2.00,  cacheWrite: null, tier: null,      sweBench: null,  capTier: 1 },
  { id: 'gpt-5-3-codex',  name: 'GPT-5.3 Codex',   displayName: 'GPT-5.3-Codex',             provider: 'OpenAI',    input: 1.75,  cachedInput: 0.175, output: 14.00, cacheWrite: null, tier: null,      sweBench: 78.0,  capTier: 3 },
  { id: 'gpt-5-4',        name: 'GPT-5.4',         displayName: 'GPT-5.4',                   provider: 'OpenAI',    input: 2.50,  cachedInput: 0.25,  output: 15.00, cacheWrite: null, tier: '≤ 272K', sweBench: 78.2,  capTier: 3 },
  { id: 'gpt-5-4-lc',     name: 'GPT-5.4 LC',      displayName: 'GPT-5.4 (long context)',    provider: 'OpenAI',    input: 5.00,  cachedInput: 0.50,  output: 22.50, cacheWrite: null, tier: '> 272K', sweBench: 78.2,  capTier: 3 },
  { id: 'gpt-5-4-mini',   name: 'GPT-5.4 mini',    displayName: 'GPT-5.4 mini',              provider: 'OpenAI',    input: 0.75,  cachedInput: 0.075, output: 4.50,  cacheWrite: null, tier: null,      sweBench: null,  capTier: 2 },
  { id: 'gpt-5-4-nano',   name: 'GPT-5.4 nano',    displayName: 'GPT-5.4 nano',              provider: 'OpenAI',    input: 0.20,  cachedInput: 0.02,  output: 1.25,  cacheWrite: null, tier: null,      sweBench: null,  capTier: 1 },
  { id: 'gpt-5-5',        name: 'GPT-5.5',         displayName: 'GPT-5.5',                   provider: 'OpenAI',    input: 5.00,  cachedInput: 0.50,  output: 30.00, cacheWrite: null, tier: '≤ 272K', sweBench: 82.6,  capTier: 4 },
  { id: 'gpt-5-5-lc',     name: 'GPT-5.5 LC',      displayName: 'GPT-5.5 (long context)',    provider: 'OpenAI',    input: 10.00, cachedInput: 1.00,  output: 45.00, cacheWrite: null, tier: '> 272K', sweBench: 82.6,  capTier: 4 },

  // ── Anthropic ──────────────────────────────────────────
  { id: 'claude-haiku-4-5',  name: 'Haiku 4.5',  displayName: 'Claude Haiku 4.5',  provider: 'Anthropic', input: 1.00, cachedInput: 0.10, output: 5.00,  cacheWrite: 1.25, tier: null, sweBench: null,  capTier: 1 },
  { id: 'claude-sonnet-4',   name: 'Sonnet 4',   displayName: 'Claude Sonnet 4',   provider: 'Anthropic', input: 3.00, cachedInput: 0.30, output: 15.00, cacheWrite: 3.75, tier: null, sweBench: null,  capTier: 2 },
  { id: 'claude-sonnet-4-5', name: 'Sonnet 4.5', displayName: 'Claude Sonnet 4.5', provider: 'Anthropic', input: 3.00, cachedInput: 0.30, output: 15.00, cacheWrite: 3.75, tier: null, sweBench: null,  capTier: 2 },
  { id: 'claude-sonnet-4-6', name: 'Sonnet 4.6', displayName: 'Claude Sonnet 4.6', provider: 'Anthropic', input: 3.00, cachedInput: 0.30, output: 15.00, cacheWrite: 3.75, tier: null, sweBench: null,  capTier: 2 },
  { id: 'claude-opus-4-5',   name: 'Opus 4.5',   displayName: 'Claude Opus 4.5',   provider: 'Anthropic', input: 5.00, cachedInput: 0.50, output: 25.00, cacheWrite: 6.25, tier: null, sweBench: null,  capTier: 3 },
  { id: 'claude-opus-4-6',   name: 'Opus 4.6',   displayName: 'Claude Opus 4.6',   provider: 'Anthropic', input: 5.00, cachedInput: 0.50, output: 25.00, cacheWrite: 6.25, tier: null, sweBench: 78.2,  capTier: 3 },
  { id: 'claude-opus-4-7',   name: 'Opus 4.7',   displayName: 'Claude Opus 4.7',   provider: 'Anthropic', input: 5.00, cachedInput: 0.50, output: 25.00, cacheWrite: 6.25, tier: null, sweBench: 82.0,  capTier: 4 },
  { id: 'claude-opus-4-8',   name: 'Opus 4.8',   displayName: 'Claude Opus 4.8',   provider: 'Anthropic', input: 5.00, cachedInput: 0.50, output: 25.00, cacheWrite: 6.25, tier: null, sweBench: null,  capTier: 4 },

  // ── Google ─────────────────────────────────────────────
  { id: 'gemini-2-5-pro',    name: 'Gemini 2.5 Pro',    displayName: 'Gemini 2.5 Pro',                provider: 'Google', input: 1.25, cachedInput: 0.125, output: 10.00, cacheWrite: null, tier: null,      sweBench: null,  capTier: 2 },
  { id: 'gemini-3-flash',    name: 'Gemini 3 Flash',    displayName: 'Gemini 3 Flash',                provider: 'Google', input: 0.50, cachedInput: 0.05,  output: 3.00,  cacheWrite: null, tier: null,      sweBench: null,  capTier: 1 },
  { id: 'gemini-3-1-pro',    name: 'Gemini 3.1 Pro',    displayName: 'Gemini 3.1 Pro',                provider: 'Google', input: 2.00, cachedInput: 0.20,  output: 12.00, cacheWrite: null, tier: '≤ 200K', sweBench: 78.8,  capTier: 3 },
  { id: 'gemini-3-1-pro-lc', name: 'Gemini 3.1 Pro LC', displayName: 'Gemini 3.1 Pro (long context)', provider: 'Google', input: 4.00, cachedInput: 0.40,  output: 18.00, cacheWrite: null, tier: '> 200K', sweBench: 78.8,  capTier: 3 },
  { id: 'gemini-3-5-flash',  name: 'Gemini 3.5 Flash',  displayName: 'Gemini 3.5 Flash',              provider: 'Google', input: 1.50, cachedInput: 0.15,  output: 9.00,  cacheWrite: null, tier: null,      sweBench: null,  capTier: 2 },

  // ── GitHub ─────────────────────────────────────────────
  { id: 'raptor-mini',      name: 'Raptor mini',      displayName: 'Raptor mini',      provider: 'GitHub',     input: 0.25, cachedInput: 0.025, output: 2.00, cacheWrite: null, tier: null, sweBench: null, capTier: 1 },

  // ── Microsoft ──────────────────────────────────────────
  { id: 'mai-code-1-flash', name: 'MAI-Code-1-Flash', displayName: 'MAI-Code-1-Flash', provider: 'Microsoft',  input: 0.75, cachedInput: 0.075, output: 4.50, cacheWrite: null, tier: null, sweBench: null, capTier: 1 },
]

export const PROVIDERS = ['OpenAI', 'Anthropic', 'Google', 'GitHub', 'Microsoft']

export const PROVIDER_COLORS = {
  OpenAI:    '#10b981', // emerald
  Anthropic: '#d97757', // coral
  Google:    '#4285f4', // blue
  GitHub:    '#a78bfa', // purple
  Microsoft: '#eab308', // amber
}
