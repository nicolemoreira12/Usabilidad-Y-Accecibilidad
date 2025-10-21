export default function Home(){
  return (
    <main>
      <h1>Bienvenido a la plataforma</h1>
      <p>Esta maqueta sigue normas básicas de usabilidad y accesibilidad.</p>
      <section aria-labelledby="usability">
        <h2 id="usability">Parámetros de usabilidad</h2>
        <ul>
          <li>Interfaz responsive sin scroll horizontal.</li>
          <li>Navegación clara: cabecera → menú → cuerpo → pie.</li>
          <li>Foco visible al navegar con teclado (Tab / Enter).</li>
        </ul>
      </section>
    </main>
  )
}
