import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../features/auth/store/authStore'
import { SidebarHeader } from './SidebarHeader'
import { SidebarBody }   from './SidebarBody'
import { SidebarFooter } from './SidebarFooter'

export const Sidebar = () => {
  const { user, logout }          = useAuthStore()
  const navigate                  = useNavigate()
  const [collapsed, setCollapsed] = useState(false)

  if (!user) return null

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (collapsed) {
    return (
      <aside className="
        relative w-12 min-h-screen flex-shrink-0 bg-white border-r border-black/[0.08] rounded-tr-2xl rounded-br-2xl
        flex items-start justify-center pt-7 shadow-[2px_0_12px_rgba(0,0,0,0.05)]
      ">
        <button
          onClick={() => setCollapsed(false)}
          aria-label="Expandir menú"
          className=" w-7 h-7 bg-white border border-gray-200 rounded-lg flex items-center justify-center shadow-sm hover:bg-[#F0FAF4] transition-colors "
        >
          <span className="text-gray-400 text-base leading-none select-none">›</span>
        </button>
      </aside>
    )
  }

  return (
    <aside
      className="
        relative min-h-screen flex-shrink-0  bg-white border-r border-black/[0.08]  rounded-tr-2xl rounded-br-2xl  shadow-[2px_0_12px_rgba(0,0,0,0.05)]
      "
      style={{
        display:'flex',
        width:'256px',
        padding:'24px',
        flexDirection:'column',
        alignItems:'flex-start',
        gap:'24px',
        fontFamily:"'Inter', sans-serif",
      }}
    >
      {/* ── Botón colapsar ── */}
      <button
        onClick={() => setCollapsed(true)}
        aria-label="Colapsar menú"
        className="
          absolute top-7 -right-3.5 z-10 w-7 h-7 bg-white border border-gray-200 rounded-lg
          flex items-center justify-center shadow-sm hover:bg-[#F0FAF4] transition-colors
        "
      >
        <span className="text-gray-400 text-base leading-none select-none">‹</span>
      </button>

      <SidebarHeader cargo={user.cargo} nombre={user.nombre} />

      <SidebarBody rol={user.rol} />

      <SidebarFooter rol={user.rol} onLogout={handleLogout} />

    </aside>
  )
}