export function Footer() {
  return (
    <footer style={{
      padding: '24px 48px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTop: '1px solid var(--border-subtle)',
      marginTop: 'auto',
    }}>
      <div style={{ fontWeight: 800, fontSize: '16px', fontFamily: 'var(--font-hanken)', letterSpacing: '-0.02em' }}>
        İşler LearnTwin AI
      </div>
      <div style={{ display: 'flex', gap: '24px', fontSize: '12px', color: 'var(--color-muted)', alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
        <span style={{ cursor: 'pointer' }}>Gizlilik Politikası</span>
        <span style={{ cursor: 'pointer' }}>Kullanım Koşulları</span>
        <span style={{ cursor: 'pointer' }}>Yardım Merkezi</span>
        <span style={{ cursor: 'pointer' }}>API Durumu</span>
        <span>© 2024 İşler LearnTwin AI. Eğitimde Kesinlik.</span>
      </div>
    </footer>
  )
}
