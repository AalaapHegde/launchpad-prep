import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Button from './Button'
import './Navbar.css'

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location])

  const isActive = (path) => location.pathname === path

  // Pages with dark hero backgrounds need white text
  const darkHeroPages = ['/why-us']
  const hasDarkHero = darkHeroPages.includes(location.pathname)

  return (
    <header className={`navbar ${isScrolled ? 'scrolled' : ''} ${!isScrolled && hasDarkHero ? 'dark-hero' : ''}`}>
      <nav className="navbar-container">
        <Link to="/" className="logo">
          <img src="/logo.png" alt="Launchpad Prep" className="logo-image" />
          <span className="logo-text">Launchpad Prep</span>
        </Link>

        <div className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
          <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
            Home
          </Link>
          <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>
            About
          </Link>
          <Link to="/why-us" className={`nav-link ${isActive('/why-us') ? 'active' : ''}`}>
            Why Us
          </Link>
          <a
            href="https://luma.com/calendar/cal-LvLbx6gS0ChhPQz?utm_source=website"
            className="nav-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            Events
          </a>
          <Button to="/apply" variant="primary" size="small">
            Apply Now
          </Button>
        </div>

        <button
          className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>
    </header>
  )
}

export default Navbar
