import './App.css'

function App() {
  return (
    <div className="app-container">
      <header>
        <h1>Welcome to Your Site! 🚀</h1>
        <p>Built with Vite + React, deployed on Vercel</p>
      </header>
      <main>
        <section className="hero">
          <h2>Hello World!</h2>
          <p>Your site is live and ready to go.</p>
          <button onClick={() => alert('Button works! 🎉')}>Click Me</button>
        </section>
      </main>
    </div>
  )
}

export default App
