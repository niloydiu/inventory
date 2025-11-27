import { Sidebar } from "./sidebar"
import { Header } from "./header"

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <div className="hidden md:block w-64 flex-shrink-0">
        <Sidebar className="fixed w-64 h-full" />
      </div>
      <div className="flex-1 flex flex-col md:pl-64">
        <Header />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
