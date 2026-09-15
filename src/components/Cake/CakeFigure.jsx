// Satu gambar kue dipakai di kamar dan di overlay tiup lilin,
// biar bentuk dan warnanya identik. Lilin mini ikut state.
export const CAKE_CANDLE_COLORS = ['#F3A8C7', '#B9A7FF', '#E8C77B', '#F3A8C7', '#B9A7FF']
export const CAKE_CANDLE_X = [40, 50, 60, 70, 80]

export default function CakeFigure({ candles, miniCandles = false, float = false, label, className = '' }) {
  const lit = (i) => Array.isArray(candles) && !!candles[i]
  const anyLit = Array.isArray(candles) && candles.some(Boolean)
  return (
    <svg
      viewBox="0 0 120 70"
      className={`${float ? 'animate-cake-float' : ''} mx-auto h-auto overflow-visible ${className}`}
      {...(label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': 'true' })}
    >
      <ellipse cx="60" cy="64" rx="44" ry="5" fill="rgba(0,0,0,0.4)" />
      <rect x="18" y="36" width="84" height="26" rx="6" fill="#FFF7EC" />
      <rect x="18" y="36" width="84" height="9" rx="4" fill="#F3A8C7" />
      <rect x="32" y="16" width="56" height="20" rx="5" fill="#F6EDDD" />
      <rect x="32" y="16" width="56" height="7" rx="3" fill="#E8C77B" />
      {anyLit && (
        <ellipse cx="60" cy="8" rx="16" ry="12" fill="rgba(232,199,123,0.3)" className="animate-glow" />
      )}
      {/* lilin nancap di tingkat atas. Api ikut state tiap lilin */}
      {miniCandles && CAKE_CANDLE_X.map((cx, i) => (
        <g key={cx}>
          <rect x={cx - 1.5} y={5} width={3} height={11} rx={1} fill={lit(i) ? CAKE_CANDLE_COLORS[i] : '#9aa0b5'} />
          <line x1={cx} y1={5} x2={cx} y2={3} stroke="#5b5348" strokeWidth={1} />
          {lit(i) && (
            <>
              <ellipse cx={cx} cy={1} rx={3} ry={4} fill="rgba(255,180,80,0.35)" />
              <ellipse cx={cx} cy={1} rx={1.6} ry={2.6} fill="#ffd98a" className="animate-flicker" style={{ transformBox: 'fill-box', transformOrigin: '50% 100%' }} />
            </>
          )}
        </g>
      ))}
    </svg>
  )
}
