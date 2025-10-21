import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const navigate = useNavigate()

  function handleSubmit(e: any){
    e.preventDefault()
    // maqueta: validación mínima
    if(email && password){
      // simular inicio de sesión
      localStorage.setItem('user', JSON.stringify({email}))
      navigate('/dashboard')
    } else {
      alert('Introduce correo y contraseña')
    }
  }

  return (
    <main>
      <h1>Ingresar</h1>
      <form onSubmit={handleSubmit} aria-label="Formulario de login">
        <label htmlFor="email">Correo</label>
        <input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />

        <label htmlFor="password">Contraseña</label>
        <input id="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />

        <button type="submit">Entrar</button>
      </form>
    </main>
  )
}
