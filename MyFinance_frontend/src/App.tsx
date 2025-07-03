// myfinance-app/frontend/src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importe as páginas da nova estrutura
import LoginPage from './pages/Login';      // Assume que 'index.tsx' é importado por padrão
import RegisterPage from './pages/Registro'; // Assume que 'index.tsx' é importado por padrão

// Componente de Dashboard (simples, apenas para navegar para ele)
const DashboardPage: React.FC = () => {
  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Bem-vindo ao Dashboard do MyFinance!</h1>
      <p>Esta é a página principal após o login.</p>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota padrão que redireciona para o login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        {/* Adicione outras rotas protegidas aqui no futuro */}
      </Routes>
    </Router>
  );
}

export default App;