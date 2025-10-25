import { useState } from 'react'
import './App.css'
import SplitText from "./SplitText";


function App() {
  return (
    <>
    <header style={{border: 'red 1px solid', width: 1000, backgroundColor: 'blue'}}>
      <div style={{textAlign: 'left', display: 'flex'}}>
        <h1>Welcome Lemar</h1>
        <button style={{margin: 15}}>Quiz</button>
        <button style={{margin: 15}}>+ Create Event</button>
      </div>
    </header>
    <div style={{display: 'flex'}}>
        <div style={{border: '1px solid red'}}>
          <p>Event name</p>
          <button>View event</button>
        </div>
        <div style={{border: '1px solid red'}}>
          <p>Event name</p>
          <button>View event</button>
        </div>
        <div style={{border: '1px solid red'}}>
          <p>Event name</p>
          <button>View event</button>
        </div>
      </div>
    </>
  )
}

export default App
