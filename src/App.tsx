import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { ConfigProvider } from 'antd'
import LoginPage from './LoginPage'
import ChatPage from './ChatPage'
import BuildScenario from './BuildScenario'

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [selectedTool, setSelectedTool] = useState(null)

  return (
    <ConfigProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
          <Route
            path="/chat"
            element={
              isLoggedIn ? (
                <ChatPage setSelectedTool={setSelectedTool} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/build"
            element={
              isLoggedIn && selectedTool ? (
                <BuildScenario tool={selectedTool} />
              ) : (
                <Navigate to="/chat" replace />
              )
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </ConfigProvider>
  )
}