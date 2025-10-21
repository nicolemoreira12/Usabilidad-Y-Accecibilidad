import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Register(){
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const navigate = useNavigate()

  function handleSubmit(e: any){
    e.preventDefault()
    if(email && password){
      // maqueta: almacenar usuario localmente
      const users = JSON.parse(localStorage.getItem('users')||'[]')
      users.push({email,password})
      localStorage.setItem('users', JSON.stringify(users))
      navigate('/login')
    }
  }

  return (
    <main>
      <h1>Registrar</h1>
      <form onSubmit={handleSubmit} aria-label="Formulario de registro">
        <label htmlFor="email">Correo</label>
        <input id="email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />

        <label htmlFor="password">Contraseña</label>
        <input id="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />

        <button type="submit">Crear cuenta</button>
      </form>
    </main>
  )
}
