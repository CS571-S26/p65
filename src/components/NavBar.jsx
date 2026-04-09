import { Button, Container, Nav, Navbar } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext.jsx'
import BrandLogo from './BrandLogo.jsx'

export default function NavBar() {
  const { isDarkMode, toggleTheme } = useTheme()

  return (
    <Navbar expand="md" className="app-navbar shadow-sm">
      <Container>
        <Navbar.Brand as={BrandLogo} />
        <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="ms-auto align-items-md-center gap-1 gap-md-2 app-navbar-links">
            <Nav.Link as={NavLink} to="/" end>
              Home
            </Nav.Link>
            <Nav.Link as={NavLink} to="/sessions">
              Sessions
            </Nav.Link>

            <Nav.Link as={NavLink} to="/about">
              About
            </Nav.Link>
            <Button
              variant="outline-secondary"
              size="sm"
                className="theme-toggle-btn"
              onClick={toggleTheme}
              aria-label="Toggle light and dark mode"
            >
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}
