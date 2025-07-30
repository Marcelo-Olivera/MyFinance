// src/pages/Home/index.tsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  CircularProgress,
  Alert,
  Button,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ListAltIcon from '@mui/icons-material/ListAlt'; // Ícone para extrato/transações
import DashboardIcon from '@mui/icons-material/Dashboard'; // Ícone para dashboard
import ExitToAppIcon from '@mui/icons-material/ExitToApp'; // Ícone para Sair/Logout
import PeopleIcon from '@mui/icons-material/People'; // Ícone para Gerenciamento de Usuários
import { jwtDecode } from 'jwt-decode'; // ✅ NOVO: Importa jwtDecode

const API_BASE_URL = 'http://localhost:3000'; // URL do backend

// Interface para os dados de resumo financeiro (totais)
interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number; // totalIncome - totalExpense
}

// Interface para o token decodificado (para pegar o role)
interface DecodedToken {
  role?: string;
  // Outras propriedades do seu token, se houver (ex: sub, email, iat, exp)
}

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null); // ✅ NOVO: Estado para o papel do usuário

  // Função para buscar o resumo financeiro (receitas/despesas totais)
  const fetchFinancialSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Token de acesso não encontrado. Faça login.');
      }

      // ✅ NOVO: Decodifica o token para obter o papel do usuário
      try {
        const decoded: DecodedToken = jwtDecode(accessToken);
        setUserRole(decoded.role || null);
      } catch (decodeError) {
        console.error("Erro ao decodificar token no Home Page:", decodeError);
        localStorage.removeItem('accessToken');
        navigate('/login');
        return;
      }

      const response = await axios.get<FinancialSummary>(`${API_BASE_URL}/transactions/summary`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setSummary(response.data);
    } catch (err: any) {
      console.error('Erro ao buscar resumo financeiro:', err);
      if (err.response && err.response.status === 401) {
        // Substituir alert por um modal customizado em produção
        alert('Sua sessão expirou ou é inválida. Por favor, faça login novamente.');
        localStorage.removeItem('accessToken');
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Erro ao carregar resumo financeiro.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialSummary();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Função para lidar com o logout
  const handleLogout = () => {
    localStorage.removeItem('accessToken'); // Remove o token de acesso
    navigate('/login'); // Redireciona para a página de login
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        width: '100vw',
        backgroundImage: 'url("/background.png")', // Certifique-se de ter essa imagem ou remova
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        color: 'white', // Cor do texto principal
      }}
    >
      <Container
        component="main"
        maxWidth="md"
        sx={{
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
          Bem-vindo(a) ao MyFinance!
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
            <CircularProgress color="secondary" />
            <Typography variant="h6" sx={{ mt: 2, color: 'white' }}>Carregando resumo financeiro...</Typography>
          </Box>
        ) : summary ? (
          <Box sx={{ width: '100%', mb: 4, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ mb: 1, color: 'white' }}>
              Saldo Atual: <span style={{ color: summary.balance >= 0 ? 'lightgreen' : 'red' }}>{formatCurrency(summary.balance)}</span>
            </Typography>
            <Typography variant="h6" sx={{ color: 'lightgreen' }}>
              Receitas Totais: {formatCurrency(summary.totalIncome)}
            </Typography>
            <Typography variant="h6" sx={{ color: 'red' }}>
              Despesas Totais: {formatCurrency(summary.totalExpense)}
            </Typography>
          </Box>
        ) : (
          <Typography variant="h6" sx={{ color: 'white', mt: 3, mb: 3 }}>
            Não foi possível carregar o resumo financeiro.
          </Typography>
        )}

        {/* Cards de Navegação - Usando Flexbox com Box */}
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap', // Permite que os itens quebrem para a próxima linha
            gap: 3, // Espaçamento entre os cards
            width: '100%',
            justifyContent: 'center', // Centraliza os cards quando há menos de 3 por linha
          }}
        >
          {/* Card para Extrato */}
          <Card
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              borderRadius: 2,
              flex: '1 1 calc(33.33% - 24px)', // 3 cards por linha no desktop (100%/3 - gap)
              maxWidth: 'calc(33.33% - 24px)', // Garante que não exceda 1/3 da largura
              minWidth: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(33.33% - 24px)' }, // Responsividade
              boxSizing: 'border-box', // Inclui padding e border no cálculo da largura
              display: 'flex', // Para alinhar conteúdo e ações
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <ListAltIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" component="div">
                Extrato
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Visualize todas as suas transações.
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center' }}>
              <Button size="small" variant="contained" color="primary" onClick={() => navigate('/transactions')}>
                Ver Extrato
              </Button>
            </CardActions>
          </Card>

          {/* Card para Dashboard*/}
          <Card
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              borderRadius: 2,
              flex: '1 1 calc(33.33% - 24px)',
              maxWidth: 'calc(33.33% - 24px)',
              minWidth: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(33.33% - 24px)' },
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <DashboardIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" component="div">
                Dashboard
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Análises e gráficos detalhados.
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center' }}>
              <Button size="small" variant="contained" color="primary" onClick={() => navigate('/dashboard')}>
                Ver Dashboard
              </Button>
            </CardActions>
          </Card>

          {/* ✅ NOVO: Renderiza o Card de Gerenciamento de Usuários APENAS SE o papel for 'ADMIN' */}
          {userRole === 'ADMIN' && (
            <Card
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: 'white',
                borderRadius: 2,
                flex: '1 1 calc(33.33% - 24px)',
                maxWidth: 'calc(33.33% - 24px)',
                minWidth: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(33.33% - 24px)' },
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <PeopleIcon sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6" component="div">
                  Gerenciar Usuários
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Acesso para administração de contas.
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center' }}>
                <Button size="small" variant="contained" color="primary" onClick={() => navigate('/admin/users')}>
                  Administrar
                </Button>
              </CardActions>
            </Card>
          )}

          {/* Card para Sair */}
          <Card
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              borderRadius: 2,
              flex: '1 1 calc(33.33% - 24px)',
              maxWidth: 'calc(33.33% - 24px)',
              minWidth: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(33.33% - 24px)' },
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <CardContent sx={{ textAlign: 'center' }}>
              <ExitToAppIcon sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" component="div">
                Sair
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Encerre sua sessão.
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center' }}>
              <Button size="small" variant="contained" color="error" onClick={handleLogout}>
                Sair
              </Button>
            </CardActions>
          </Card>
        </Box>

      </Container>
    </Box>
  );
};

export default HomePage;