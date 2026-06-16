import { NavLink } from 'react-router-dom'
import { SIDEBAR_CONFIG } from './sidebarItems'
import { resolveIcon } from './sidebarIcons'

interface SidebarFooterProps {
  rol: keyof typeof SIDEBAR_CONFIG
  onLogout: () => void
  collapsed?: boolean
}

export const SidebarFooter = ({ rol, onLogout, collapsed = false }: SidebarFooterProps) => {
  const allSections = SIDEBAR_CONFIG[rol] || []
  const footerSection = allSections.find((s) => s.section === 'Footer')

  if (!footerSection) return null

  // ─── Versión colapsada ───
  if (collapsed) {
    return (
      <div className="flex flex-col items-center w-full gap-2">
        {/* Barra divisora más corta */}
        <div
          className="rounded-full"
          style={{
            width: '24px',
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #8EBFA3, transparent)',
            opacity: 0.35,
            marginBottom: '4px',
          }}
        />

        {footerSection.items.map((item) => {
          if (item.label === 'Cerrar Sesión') {
            const Icon = resolveIcon(item.label, rol)

            return (
              <button
                key="logout"
                onClick={onLogout}
                aria-label="Cerrar Sesión"
                title="Cerrar Sesión"
                className="
                  w-10 h-10 rounded-lg flex items-center justify-center
                  text-red-500 hover:bg-red-50 transition-all duration-200
                "
              >
                <Icon
                  width={20}
                  height={20}
                  className="flex-shrink-0"
                  style={{ color: '#f87171', opacity: 0.8 }}
                />
              </button>
            )
          }

          const Icon = resolveIcon(item.label, rol)

          return (
            <NavLink
              key={item.path}
              to={item.path ?? '#'}
              aria-label={item.label}
              title={item.label}
              className={({ isActive }) =>
                [
                  'w-10 h-10 rounded-lg flex items-center justify-center',
                  'transition-all duration-200',
                  isActive
                    ? 'text-[#308C58] bg-[#EAF7EF]'
                    : 'text-[#8EBFA3] hover:text-[#308C58] hover:bg-[#F0FAF4]',
                ].join(' ')
              }
            >
              {({ isActive }) => (
                <Icon
                  width={20}
                  height={20}
                  className="flex-shrink-0"
                  style={{
                    color: isActive ? '#308C58' : '#8EBFA3',
                    opacity: isActive ? 1 : 0.6,
                  }}
                />
              )}
            </NavLink>
          )
        })}
      </div>
    )
  }

  // ─── Versión expandida ───
  return (
    <div
      className="flex flex-col w-full"
      style={{ gap: '8px', fontFamily: "'Inter', sans-serif" }}
    >
      <div className="w-full h-px bg-[#8EBFA3] opacity-35 rounded-full mb-2" />

      {footerSection.items.map((item) => {
        if (item.label === 'Cerrar Sesión') {
          const Icon = resolveIcon(item.label, rol)

          return (
            <button
              key="logout"
              onClick={onLogout}
              className="
                flex items-center gap-3 w-full px-3 py-[10px] rounded-xl
                text-sm font-semibold text-red-500
                hover:bg-red-50 transition-all duration-200
              "
            >
              <Icon
                width={20}
                height={20}
                className="flex-shrink-0"
                style={{ color: '#f87171', opacity: 0.8 }}
              />
              <span className="flex-1 text-left">{item.label}</span>
            </button>
          )
        }

        const Icon = resolveIcon(item.label, rol)

        return (
          <NavLink
            key={item.path}
            to={item.path ?? '#'}
            className={({ isActive }) =>
              [
                'flex items-center gap-3 w-full px-3 py-[10px] rounded-xl',
                'text-sm font-medium transition-all duration-200',
                isActive
                  ? 'text-[#308C58] bg-[#EAF7EF]'
                  : 'text-[#6B9E83] hover:text-[#308C58] hover:bg-[#F0FAF4]',
              ].join(' ')
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  width={20}
                  height={20}
                  className="flex-shrink-0"
                  style={{
                    color: isActive ? '#308C58' : '#8EBFA3',
                    opacity: isActive ? 1 : 0.6,
                  }}
                />
                <span className="flex-1 text-left">{item.label}</span>
              </>
            )}
          </NavLink>
        )
      })}
    </div>
  )
}