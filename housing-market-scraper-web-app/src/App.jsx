import { useState } from 'react'
import './App.css'

// Import housing data
import housingData from './assets/HousingData/data.json'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <section id="center">
        <div className="hero">
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.jsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button
          type="button"
          className="counter"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
      </section>

      <section id="center">
        <div>
        <h1>housing List</h1>
        <ul>
          {housingData.map((house) => (
            <li key={house.address}>{house.address}</li>
          ))}
        </ul>
      </div>
      </section>
    </>
  )
}

export default App
