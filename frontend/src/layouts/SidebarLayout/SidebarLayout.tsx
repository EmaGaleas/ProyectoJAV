import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { PageLayout } from '../PageLayout'

export const SidebarLayout = () => (
  <div className="flex min-h-screen bg-[#F2F2F2]">
 
    <Sidebar />
 
    <main className="flex-1 overflow-y-auto">
      <PageLayout>
        <Outlet />
      </PageLayout>
    </main>
 
  </div>
)