import { Link } from 'react-router-dom'
import './Button.css'

function Button({ children, to, href, variant = 'primary', size = 'medium', onClick, type = 'button' }) {
  const className = `btn btn-${variant} btn-${size}`

  if (to) {
    return (
      <Link to={to} className={className}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    )
  }

  return (
    <button type={type} className={className} onClick={onClick}>
      {children}
    </button>
  )
}

export default Button
