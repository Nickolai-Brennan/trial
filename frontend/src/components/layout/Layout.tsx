import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} CMS Platform. All rights reserved.</p>
      </footer>
    </div>
  )
}
