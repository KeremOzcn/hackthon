interface SkeletonProps {
  height?: string | number
  width?: string | number
  borderRadius?: string | number
  style?: React.CSSProperties
}

export function Skeleton({ height = '20px', width = '100%', borderRadius = '8px', style }: SkeletonProps) {
  return (
    <div
      style={{
        height,
        width,
        borderRadius,
        background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)',
        backgroundSize: '200% 100%',
        animation: 'skeleton-shimmer 1.5s infinite',
        ...style,
      }}
    />
  )
}

export function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <Skeleton height="16px" width="60%" />
      {Array.from({ length: lines - 1 }).map((_, i) => (
        <Skeleton key={i} height="14px" width={i === lines - 2 ? '40%' : '90%'} />
      ))}
    </div>
  )
}

export function SkeletonRow() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px', borderBottom: '1px solid var(--border-subtle)' }}>
      <Skeleton width="38px" height="38px" borderRadius="50%" style={{ flexShrink: 0 }} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <Skeleton height="13px" width="45%" />
        <Skeleton height="11px" width="28%" />
      </div>
      <Skeleton width="44px" height="22px" borderRadius="6px" />
    </div>
  )
}
