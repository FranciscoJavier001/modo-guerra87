import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import Login from './pages/Login'

function AppWrapper() {
  const { usuario } = useAuth();
  return usuario ? <App /> : <Login />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <AppWrapper />
    </AuthProvider>
  </React.StrictMode>,
)