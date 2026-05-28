export function Step({ n, label }: { n: number; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-1.5">
      <div className="flex items-center justify-center rounded-full shrink-0"
        style={{ width: 20, height: 20, background: '#308C58' }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{n}</span>
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, color: '#8EBFA3', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
        {label}
      </span>
    </div>
  )
}

export function SectionLabel({ text }: { text: string }) {
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color: '#308C58', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
      {text}
    </span>
  )
}
