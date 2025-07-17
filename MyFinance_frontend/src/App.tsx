// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './components/theme';
import { jwtDecode } from 'jwt-decode';
//Paginas importadas
import RegisterPage from './pages/Registro';
import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';
import AdminUsersPage from './pages/Admin/Users';
import CategoriesPage from './pages/Categories';
import TransactionsPage from './pages/Transactions'; 

// Componente de Rota Protegida (mantido o mesmo, com allowedRoles)
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles) {
    try {
      const decodedToken: { role?: string } = jwtDecode(accessToken);
      if (!decodedToken.role || !allowedRoles.includes(decodedToken.role)) {
        // Substituir alert por um modal customizado em produção
        alert('Você não tem permissão para acessar esta página.');
        return <Navigate to="/dashboard" replace />;
      }
    } catch (error) {
      console.error("Erro ao decodificar token:", error);
      localStorage.removeItem('accessToken');
      return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Rotas protegidas (para qualquer usuário logado) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Rota de ADMIN (protegida por papel) */}
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminUsersPage />
              </ProtectedRoute>
            }
          />

          {/* Rota para Gerenciar Categorias */}
          <Route
            path="/categories"
            element={
              <ProtectedRoute> {/* Categorias são para qualquer usuário logado */}
                <CategoriesPage />
              </ProtectedRoute>
            }
          />

          {/* <-- NOVO: Rota para a Página de Transações/Extrato --> */}
          <Route
            path="/transactions"
            element={
              <ProtectedRoute> {/* Transações são para qualquer usuário logado */}
                <TransactionsPage />
              </ProtectedRoute>
            }
          />

          {/* Adicione outras rotas protegidas aqui no futuro */}
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
