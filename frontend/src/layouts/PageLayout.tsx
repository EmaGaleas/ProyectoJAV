import { useLocation } from 'react-router-dom'
import { ROUTE_LABELS } from '../router/routeLabels'

interface PageLayoutProps {
  children: React.ReactNode
}

const buildCrumbs = (pathname: string) => {
  if (pathname === '/') return [{ label: ROUTE_LABELS['/'] ?? 'Dashboard' }]

  const segments = pathname.split('/').filter(Boolean)
  return segments.map((seg, i) => {
    const to    = '/' + segments.slice(0, i + 1).join('/')
    const label = ROUTE_LABELS[to] ?? (
      seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' ')
    )
    return { label }
  })
}

const Breadcrumb = () => {
  const { pathname } = useLocation()
  const crumbs       = buildCrumbs(pathname)

  return (
    <div
      className="flex items-center gap-2 rounded-xl"
      style={{ padding: '10px' }}
    >
      {crumbs.map(({ label }, index) => (
        <div key={label} className="flex items-center gap-2">

          {index > 0 && (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M6 4L10 8L6 12"
                stroke="#8EBFA3"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}

          <span
            className={
              index === crumbs.length - 1
                ? 'font-semibold text-[#308C58]'
                : 'font-medium text-[#8EBFA3]'
            }
            style={{ fontSize: '16px' }} 
          >
            {label}
          </span>

        </div>
      ))}
    </div>
  )
}

export const PageLayout = ({ children }: PageLayoutProps) => (
  <div className="flex flex-col min-h-full bg-[#F2F2F2]">

    <div
      className="w-full bg-[#F2F2F2]"
      style={{ padding: '24px' }}
    >
      <Breadcrumb />
    </div>

    <div className="flex-1 px-6 pb-8">
      {children}
    </div>

  </div>
)