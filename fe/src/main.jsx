import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
    // 개발 이후에 StrictMode를 제거하고 배포
    <StrictMode>
    <App />
  </StrictMode>,
)
