import { NavLink } from 'react-router-dom'

export default function BrandLogo() {
  return (
    <NavLink to="/" className="brand-logo text-decoration-none">
      <span className="brand-logo-mark">♣</span>
      <span className="brand-logo-name">ChipStack</span>
    </NavLink>
  )
}
