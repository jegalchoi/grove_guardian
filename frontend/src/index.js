import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'
import { GroveProvider } from './context'
import 'bootstrap/dist/css/bootstrap.css'

import { App } from './App.jsx'

// ReactDOM.render(
//   <GroveProvider>
//     <Router>
//       <App />
//     </Router>
//   </GroveProvider>,
//   document.getElementById('root')
// )

ReactDOM.createRoot(document.getElementById('root')).render(
  <GroveProvider>
    <Router>
      <App />
    </Router>
  </GroveProvider>
)
