import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export const SidebarLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Tu menú lateral */}
      <Sidebar />

      {/* El área principal donde cambian las vistas según la URL */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet /> 
      </main>
    </div>
  )
}