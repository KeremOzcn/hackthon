import Link from 'next/link'

const PRODUCT_LINKS = [
  { label: 'Özellikler', href: '#' },
  { label: 'Fiyatlandırma', href: '#' },
  { label: 'Nasıl Çalışır?', href: '#' },
  { label: 'Entegrasyonlar', href: '#' },
]

const RESOURCE_LINKS = [
  { label: 'Yardım Merkezi', href: '#' },
  { label: 'Blog', href: '#' },
  { label: 'API Dokümantasyonu', href: '#' },
  { label: 'SSS', href: '#' },
]

const COMPANY_LINKS = [
  { label: 'Hakkımızda', href: '#' },
  { label: 'Kariyer', href: '#' },
  { label: 'İletişim', href: '#' },
  { label: 'Basın Kiti', href: '#' },
]

function SocialXIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function SocialLinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function SocialInstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function SocialYouTubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

export function Footer() {
  return (
    <footer
      style={{
        background: 'var(--surface-lowest)',
        borderTop: '0.5px solid var(--border-subtle)',
        marginTop: 'auto',
      }}
    >
      <div
        className="px-6 md:px-12 py-12 md:py-16"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {/* Column 1 — Brand */}
        <div className="flex flex-col gap-4">
          <div
            className="font-extrabold tracking-tight"
            style={{
              fontFamily: 'var(--font-hanken)',
              fontSize: '1.125rem',
              color: 'var(--color-text)',
              background: 'linear-gradient(90deg, var(--color-text) 0%, var(--color-accent) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            İşler LearnTwin AI
          </div>
          <p
            className="text-sm leading-relaxed"
            style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-inter)' }}
          >
            Her öğrencinin öğrenme biçimi görünür olsun.
          </p>
          <div className="flex items-center gap-4 pt-2">
            <a href="#" aria-label="X (Twitter)" className="transition-colors duration-150" style={{ color: 'var(--color-muted)' }}>
              <SocialXIcon />
            </a>
            <a href="#" aria-label="LinkedIn" className="transition-colors duration-150" style={{ color: 'var(--color-muted)' }}>
              <SocialLinkedInIcon />
            </a>
            <a href="#" aria-label="Instagram" className="transition-colors duration-150" style={{ color: 'var(--color-muted)' }}>
              <SocialInstagramIcon />
            </a>
            <a href="#" aria-label="YouTube" className="transition-colors duration-150" style={{ color: 'var(--color-muted)' }}>
              <SocialYouTubeIcon />
            </a>
          </div>
        </div>

        {/* Column 2 — Ürün */}
        <div className="flex flex-col gap-4">
          <div
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: 'var(--color-text)', fontFamily: 'var(--font-hanken)' }}
          >
            Ürün
          </div>
          <ul className="flex flex-col gap-3">
            {PRODUCT_LINKS.map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="text-sm transition-colors duration-150"
                  style={{ color: 'var(--color-muted)', textDecoration: 'none', fontFamily: 'var(--font-inter)' }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3 — Kaynaklar */}
        <div className="flex flex-col gap-4">
          <div
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: 'var(--color-text)', fontFamily: 'var(--font-hanken)' }}
          >
            Kaynaklar
          </div>
          <ul className="flex flex-col gap-3">
            {RESOURCE_LINKS.map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="text-sm transition-colors duration-150"
                  style={{ color: 'var(--color-muted)', textDecoration: 'none', fontFamily: 'var(--font-inter)' }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4 — Şirket */}
        <div className="flex flex-col gap-4">
          <div
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: 'var(--color-text)', fontFamily: 'var(--font-hanken)' }}
          >
            Şirket
          </div>
          <ul className="flex flex-col gap-3">
            {COMPANY_LINKS.map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="text-sm transition-colors duration-150"
                  style={{ color: 'var(--color-muted)', textDecoration: 'none', fontFamily: 'var(--font-inter)' }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="px-6 md:px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4"
        style={{
          borderTop: '0.5px solid var(--border-subtle)',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <div
          className="text-xs"
          style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-inter)' }}
        >
          &copy; 2025 İşler LearnTwin AI. Tüm hakları saklıdır.
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
          <Link
            href="#"
            className="text-xs transition-colors duration-150"
            style={{ color: 'var(--color-muted)', textDecoration: 'none', fontFamily: 'var(--font-inter)' }}
          >
            Gizlilik Politikası
          </Link>
          <Link
            href="#"
            className="text-xs transition-colors duration-150"
            style={{ color: 'var(--color-muted)', textDecoration: 'none', fontFamily: 'var(--font-inter)' }}
          >
            Kullanım Koşulları
          </Link>
          <Link
            href="#"
            className="text-xs transition-colors duration-150"
            style={{ color: 'var(--color-muted)', textDecoration: 'none', fontFamily: 'var(--font-inter)' }}
          >
            KVKK Aydınlatma Metni
          </Link>
        </div>
      </div>
    </footer>
  )
}
