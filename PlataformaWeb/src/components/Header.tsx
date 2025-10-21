import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:'1rem'}}>
      <div>
        <Link to="/" aria-label="Inicio">
          <strong>Plataforma</strong>
        </Link>
      </div>
      <nav aria-label="Navegación principal">
        <Link to="/" style={{marginRight:12}}>Inicio</Link>
        <Link to="/dashboard" style={{marginRight:12}}>Dashboard</Link>
        <Link to="/login" style={{marginRight:12}}>Ingresar</Link>
        <Link to="/register">Registrar</Link>
      </nav>
    </header>
  )
}
