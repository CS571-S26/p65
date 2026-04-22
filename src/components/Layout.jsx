import { Outlet } from 'react-router-dom'
import '../App.css'
import NavBar from './NavBar.jsx'

export default function Layout() {
  return (
    <div className="app-shell">
      <NavBar />

      <main className="app-content">
        <Outlet />
      </main>

      <footer className="app-footer">Copyright Aron Szucs</footer>
    </div>
  )
}
