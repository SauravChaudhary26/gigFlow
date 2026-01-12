import { useState } from 'react'
import './App.css'
import { SocketProvider } from './context/SocketContext'

function App() {
  const [count, setCount] = useState(0)
  
  // TODO: Replace with actual logged-in user ID
  const userId = "6783c1b0c96841f4b8069502"; 

  return (
    <SocketProvider userId={userId}>
      <div className='text-3xl text-red-500'>
            Hello
      </div>
    </SocketProvider>
  )
}

export default App
