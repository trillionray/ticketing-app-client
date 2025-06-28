import React from 'react'
import ReactDOM from 'react-dom/client'
// Import the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.js'
import './index.css'

import 'notyf/notyf.min.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
