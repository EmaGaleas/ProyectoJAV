import { NavLink, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../features/auth/store/authStore'
import { SIDEBAR_CONFIG } from './sidebarItems'
import { useState } from 'react'

export const Sidebar = () => {
  const { user, logout }    = useAuthStore()
  const navigate            = useNavigate()
  const [openItem, setOpen] = useState<string | null>(null)

  if (!user) return null

  const sections = SIDEBAR_CONFIG[user.rol]

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      {sections.map((section) => (
        <div key={section.section} className="sidebar__section">
          <span className="sidebar__section-label">{section.section}</span>

          {section.items.map((item) => {
            // Cerrar sesión lo manejamos aparte
            if (item.label === 'Cerrar Sesión') {
              return (
                <button
                  key="logout"
                  onClick={handleLogout}
                  className="sidebar__item sidebar__item--logout"
                >
                  {item.label}
                </button>
              )
            }

            // Item con children — acordeón
            if (item.children?.length) {
              const isOpen = openItem === item.label
              return (
                <div key={item.label} className="sidebar__group">
                  <button
                    className="sidebar__item sidebar__item--parent"
                    onClick={() => setOpen(isOpen ? null : item.label)}
                  >
                    <span>{item.label}</span>
                    <span>{isOpen ? '▴' : '▾'}</span>
                  </button>

                  {isOpen && (
                    <div className="sidebar__children">
                      {item.children.map((child) => (
                        <NavLink
                          key={child.path}
                          to={child.path}
                          className={({ isActive }) =>
                            `sidebar__child ${isActive ? 'sidebar__child--active' : ''}`
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

            // Item simple
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `sidebar__item ${isActive ? 'sidebar__item--active' : ''}`
                }
              >
                {item.label}
              </NavLink>
            )
          })}
        </div>
      ))}
    </aside>
  )
}