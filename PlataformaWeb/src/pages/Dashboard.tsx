import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Dashboard(){
  const [user, setUser] = useState<{email?:string}|null>(null)
  const navigate = useNavigate()

  useEffect(()=>{
    const u = localStorage.getItem('user')
    if(!u) navigate('/login')
    else setUser(JSON.parse(u))
  },[])

  function logout(){
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <p>Sesión iniciada como: {user?.email}</p>
      <button onClick={logout}>Cerrar sesión</button>
    </main>
  )
}
