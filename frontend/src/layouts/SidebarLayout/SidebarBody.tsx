import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import { SIDEBAR_CONFIG } from './sidebarItems'
import { resolveIcon } from './sidebarIcons'

interface SidebarBodyProps {
  rol: keyof typeof SIDEBAR_CONFIG
  collapsed?: boolean
}

const ITEM_PX = 12
const ICON_W = 20
const GAP = 12
const TEXT_START = ITEM_PX + ICON_W + GAP
const VLINE_X = ITEM_PX + ICON_W / 2
const CURVE_W = TEXT_START - VLINE_X
const CURVE_R = 8

export const SidebarBody = ({ rol, collapsed = false }: SidebarBodyProps) => {
  const [openItem, setOpen] = useState<string | null>(null)
  const [hoverItem, setHoverItem] = useState<string | null>(null)

  const allSections = SIDEBAR_CONFIG[rol]
  const mainSections = allSections.filter((s) => s.section !== 'Footer')

  const handleToggle = (label: string) =>
    setOpen((prev) => (prev === label ? null : label))

  // ─── Versión colapsada ───
  if (collapsed) {
    return (
      <nav className="flex-1 flex flex-col items-center w-full gap-4">
        {mainSections.map((section) => (
          <div key={section.section} className="flex flex-col items-center w-full gap-2">
            {/* Barra divisora más corta */}
            {mainSections.indexOf(section) > 0 && (
              <div
                className="rounded-full"
                style={{
                  width: '24px',
                  height: '1px',
                  background: 'linear-gradient(90deg, transparent, #93C5A9, transparent)',
                  opacity: 0.45,
                }}
              />
            )}

            {/* Items colapsados */}
            <div className="flex flex-col items-center w-full gap-2">
              {section.items.map((item) => {
                const Icon = resolveIcon(item.label, rol)
                const isHovered = hoverItem === item.label
                const hasChildren = item.children && item.children.length > 0

                if (hasChildren) {
                  // ─── Item con hijos (en hover muestra popover) ───
                  return (
                    <div
                      key={item.label}
                      className="relative w-full flex justify-center group"
                      onMouseEnter={() => setHoverItem(item.label)}
                      onMouseLeave={() => setHoverItem(null)}
                    >
                      <button
                        aria-label={item.label}
                        className={[
                          'w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200',
                          isHovered
                            ? 'text-[#308C58] bg-[#EAF7EF]'
                            : 'text-[#8EBFA3] hover:text-[#308C58] hover:bg-[#F0FAF4]',
                        ].join(' ')}
                      >
                        <Icon
                          width={20}
                          height={20}
                          className="flex-shrink-0"
                          style={{
                            color: isHovered ? '#308C58' : '#8EBFA3',
                            opacity: isHovered ? 1 : 0.55,
                          }}
                        />
                      </button>

                      {/* ─── Popover con hijos ─── */}
                      {isHovered && (
                        <div
                          className="
                            absolute left-full top-0 ml-2 bg-white rounded-xl shadow-lg 
                            border border-gray-100 p-2 z-50 whitespace-nowrap min-w-[180px]
                            animate-in fade-in slide-in-from-left-2 duration-200
                          "
                          onMouseEnter={() => setHoverItem(item.label)}
                          onMouseLeave={() => setHoverItem(null)}
                        >
                          <div className="text-xs font-semibold text-[#8EBFA3] uppercase px-3 py-2 opacity-60">
                            {item.label}
                          </div>

                          {item.children!.map((child) => (
                            <NavLink
                              key={child.path}
                              to={child.path}
                              className={({ isActive }) =>
                                [
                                  'flex items-center px-3 py-2 rounded-lg text-sm transition-all duration-150',
                                  isActive
                                    ? 'text-[#1A6640] font-semibold bg-[#EAF7EF]'
                                    : 'text-[#8EBFA3] font-normal hover:text-[#308C58] hover:bg-[#F0FAF4]',
                                ].join(' ')
                              }
                            >
                              {child.label}
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                }

                // ─── Item sin hijos ───
                if (!item.path) return null

                return (
                  <NavLink
                    key={item.label}
                    to={item.path}
                    aria-label={item.label}
                    className={({ isActive }) =>
                      [
                        'w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200',
                        isActive
                          ? 'text-[#308C58] bg-[#EAF7EF]'
                          : 'text-[#8EBFA3] hover:text-[#308C58] hover:bg-[#F0FAF4]',
                      ].join(' ')
                    }
                    title={item.label}
                  >
                    <Icon
                      width={20}
                      height={20}
                      className="flex-shrink-0"
                      style={{ color: '#8EBFA3', opacity: 0.55 }}
                    />
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </nav>
    )
  }

  // ─── Versión expandida ───
  return (
    <nav className="flex-1 flex flex-col overflow-y-auto w-full" style={{ gap: '6px' }}>
      {mainSections.map((section, sectionIdx) => (
        <div key={section.section} className="flex flex-col w-full">
          {sectionIdx > 0 && (
            <div
              className="rounded-full"
              style={{
                height: '1px',
                background:
                  'linear-gradient(90deg, transparent, #93C5A9 20%, #93C5A9 80%, transparent)',
                opacity: 0.45,
                margin: '10px 4px 18px',
              }}
            />
          )}

          <span
            className="font-semibold uppercase text-[#8EBFA3]"
            style={{
              fontSize: '10px',
              letterSpacing: '0.15em',
              paddingLeft: `${ITEM_PX}px`,
              marginBottom: '6px',
              display: 'block',
            }}
          >
            {section.section}
          </span>

          <div className="flex flex-col w-full" style={{ gap: '2px' }}>
            {section.items.map((item) => {
              /* ── Dropdown ── */
              if (item.children?.length) {
                const isOpen = openItem === item.label
                const Icon = resolveIcon(item.label, rol)

                return (
                  <div key={item.label} className="flex flex-col w-full">
                    <button
                      onClick={() => handleToggle(item.label)}
                      className={[
                        'flex items-center w-full rounded-xl transition-all duration-200',
                        'text-[14px] font-medium',
                        isOpen
                          ? 'text-[#308C58] bg-[#EAF7EF]'
                          : 'text-[#8EBFA3] hover:text-[#308C58] hover:bg-[#F0FAF4]',
                      ].join(' ')}
                      style={{ gap: `${GAP}px`, padding: `10px ${ITEM_PX}px` }}
                    >
                      <Icon
                        width={ICON_W}
                        height={ICON_W}
                        className="flex-shrink-0 transition-colors duration-150"
                        style={{
                          color: isOpen ? '#308C58' : '#8EBFA3',
                          opacity: isOpen ? 1 : 0.55,
                        }}
                      />
                      <span className="flex-1 text-left" style={{ lineHeight: '1.2' }}>
                        {item.label}
                      </span>
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 16 16"
                        fill="none"
                        className="flex-shrink-0 transition-transform duration-250"
                        style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                      >
                        <path
                          d="M4 6L8 10L12 6"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    {isOpen && (
                      <div
                        className="relative w-full flex flex-col"
                        style={{ paddingTop: '2px', paddingBottom: '4px', gap: '0px' }}
                      >
                        <div
                          className="absolute rounded-full"
                          style={{
                            left: `${VLINE_X}px`,
                            top: 0,
                            bottom: '50%',
                            width: '1.5px',
                            background: 'linear-gradient(to bottom, #8EBFA3, #8EBFA3CC)',
                            opacity: 0.55,
                          }}
                        />
                        {item.children.map((child) => (
                          <div
                            key={child.path}
                            className="relative flex items-center w-full"
                            style={{ minHeight: '40px' }}
                          >
                            <div
                              className="absolute pointer-events-none"
                              style={{
                                left: `${VLINE_X}px`,
                                top: 0,
                                height: '50%',
                                width: `${CURVE_W}px`,
                                borderLeft: '1.5px solid #8EBFA3',
                                borderBottom: '1.5px solid #8EBFA3',
                                borderBottomLeftRadius: `${CURVE_R}px`,
                                opacity: 0.55,
                              }}
                            />
                            <NavLink
                              to={child.path}
                              className={({ isActive }) =>
                                [
                                  'flex-1 flex items-center rounded-lg transition-all duration-150',
                                  'text-[14px]',
                                  isActive
                                    ? 'text-[#1A6640] font-semibold bg-[#EAF7EF]'
                                    : 'text-[#8EBFA3] font-normal hover:text-[#308C58] hover:bg-[#F0FAF4]',
                                ].join(' ')
                              }
                              style={{
                                paddingLeft: `${TEXT_START}px`,
                                paddingRight: `${ITEM_PX}px`,
                                paddingTop: '9px',
                                paddingBottom: '9px',
                                lineHeight: '1.2',
                              }}
                            >
                              {child.label}
                            </NavLink>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }

              /* ── Ítem sin hijos ── */
              const Icon = resolveIcon(item.label, rol)

              return (
                <NavLink
                  key={item.path}
                  to={item.path ?? '#'}
                  className={({ isActive }) =>
                    [
                      'flex items-center w-full rounded-xl transition-all duration-200',
                      'text-[14px] font-medium',
                      isActive
                        ? 'text-[#308C58] bg-[#EAF7EF]'
                        : 'text-[#8EBFA3] hover:text-[#308C58] hover:bg-[#F0FAF4]',
                    ].join(' ')
                  }
                  style={{ gap: `${GAP}px`, padding: `10px ${ITEM_PX}px` }}
                >
                  <Icon
                    width={ICON_W}
                    height={ICON_W}
                    className="flex-shrink-0 transition-colors duration-150"
                    style={{ color: '#8EBFA3', opacity: 0.55 }}
                  />
                  <span className="flex-1" style={{ lineHeight: '1.2' }}>
                    {item.label}
                  </span>
                </NavLink>
              )
            })}
          </div>
        </div>
      ))}
    </nav>
  )
}