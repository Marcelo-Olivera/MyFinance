// src/pages/Dashboard/index.tsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Container, Card, CardContent, List, ListItem, ListItemText, Divider, Chip, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Importe jwt_decode

const API_BASE_URL = 'http://localhost:3000'; // URL do seu backend NestJS

// Interface para o payload do JWT (conforme definido no backend)
interface UserPayload {
  email: string;
  sub: number; // ID do usuário
  role: string; // Papel do usuário (ADMIN, USER)
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<any>(null); // Estado para armazenar os dados do usuário (id, email, role)
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento
  const [error, setError] = useState<string | null>(null); // Estado para erros
  const [isAdmin, setIsAdmin] = useState(false); // Estado para verificar se é admin

  const handleLogout = () => {
    // Remover o token do localStorage
    localStorage.removeItem('accessToken');
    // Redirecionar para a página de login
    navigate('/login');
  };

  // Função para verificar o papel do usuário no token
  const checkAdminRole = () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const decoded: UserPayload = jwtDecode(token);
        if (decoded.role === 'ADMIN') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false); // Garante que seja falso se não for admin
        }
      } catch (error) {
        console.error("Erro ao decodificar token para verificar role:", error);
        // Se o token for inválido/expirado, o ProtectedRoute deve lidar com o redirecionamento
      }
    } else {
        setIsAdmin(false);
    }
  };


  // Função para buscar os dados do perfil do usuário do backend
  const fetchUserProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Token de acesso não encontrado. Faça login.');
      }

      const response = await axios.get(`${API_BASE_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Envia o token no cabeçalho Authorization
        },
      });

      setUserData(response.data.user); // Armazena os dados do usuário retornados pelo backend
      console.log('Dados do perfil do usuário:', response.data.user);

    } catch (err: any) {
      console.error('Erro ao buscar perfil do usuário:', err);
      // Se for um erro 401 (Unauthorized), significa que o token expirou ou é inválido
      if (err.response && err.response.status === 401) {
        alert('Sua sessão expirou ou é inválida. Por favor, faça login novamente.');
        localStorage.removeItem('accessToken'); // Limpa o token inválido
        navigate('/login'); // Redireciona para o login
      } else {
        setError(err.response?.data?.message || 'Erro ao carregar dados do perfil.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Efeitos ao montar o componente
  useEffect(() => {
    checkAdminRole();    // Verifica o papel do usuário (ADMIN/USER)
    fetchUserProfile();  // Busca os dados do perfil do usuário
  }, [navigate]); // O `Maps` é uma dependência do useEffect

  // --- DADOS FICTÍCIOS PARA SALDO E TRANSAÇÕES (MANTIDOS POR ENQUANTO) ---
  const totalBalance = 5234.56; // Saldo total fictício
  const recentTransactions = [
    { id: 1, description: 'Pagamento de Salário', amount: 3500.00, type: 'income', category: 'Salário', date: '2025-06-30' },
    { id: 2, description: 'Supermercado', amount: -250.75, type: 'expense', category: 'Alimentação', date: '2025-07-02' },
    { id: 3, description: 'Conta de Luz', amount: -120.00, type: 'expense', category: 'Contas Fixas', date: '2025-07-01' },
    { id: 4, description: 'Venda de Item Usado', amount: 80.00, type: 'income', category: 'Vendas', date: '2025-06-29' },
    { id: 5, description: 'Restaurante', amount: -75.50, type: 'expense', category: 'Lazer', date: '2025-07-01' },
  ];
  // --- FIM DOS DADOS FICTÍCIOS ---

  const handleGoToCategories = () => { // Nova função para navegar para categorias
    navigate('/categories');
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
        backgroundImage: 'url("/background.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        color: 'white',
      }}
    >
      <Container
        component="main"
        maxWidth="md"
        sx={{
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: 'rgba(0, 0, 0, 0.6)', // Fundo semi-transparente para o conteúdo
          backdropFilter: 'blur(5px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* Renderização Condicional: Carregando / Erro / Conteúdo */}
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
            <CircularProgress color="secondary" />
            <Typography variant="h6" sx={{ mt: 2, color: 'white' }}>Carregando dados do usuário...</Typography>
          </Box>
        ) : error ? (
          <Box sx={{ py: 4 }}>
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
            <Button variant="contained" onClick={() => navigate('/login')} sx={{ mt: 2 }}>
              Voltar para o Login
            </Button>
          </Box>
        ) : (
          <>
            <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
              Bem-vindo, {userData?.email || 'Usuário'}! {/* Usando email como fallback */}
            </Typography>

            {/* Botão de Admin Condicional */}
            {isAdmin && ( // Apenas mostra se isAdmin for true
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/admin/users')}
                sx={{ mb: 2 }} // Ajustei a margem para caber o novo botão
              >
                Gerenciar Usuários (Admin)
              </Button>
            )}

            {/* Botão para Gerenciar Categorias */}
            <Button
              variant="outlined" // Outlined para diferenciar
              color="info" // Cor info do tema para o botão de categorias
              onClick={handleGoToCategories}
              sx={{ mb: 4 }}
            >
              Gerenciar Categorias
            </Button>


            {/* Card de Saldo Total */}
            <Card sx={{ width: '100%', maxWidth: 400, mb: 4, backgroundColor: 'rgba(255, 255, 255, 0.15)', color: 'white' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h6" gutterBottom>
                  Saldo Total
                </Typography>
                <Typography variant="h3" component="p" sx={{ fontWeight: 'bold', color: 'secondary.main' }}>
                  R$ {totalBalance.toFixed(2).replace('.', ',')}
                </Typography>
              </CardContent>
            </Card>

            {/* Card de Transações Recentes */}
            <Card sx={{ width: '100%', maxWidth: 600, mb: 4, backgroundColor: 'rgba(255, 255, 255, 0.15)', color: 'white' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ textAlign: 'center', mb: 2 }}>
                  Transações Recentes
                </Typography>
                <List>
                  {recentTransactions.map((transaction, index) => (
                    <React.Fragment key={transaction.id}>
                      <ListItem sx={{ py: 1 }}>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                {transaction.description}
                              </Typography>
                              <Typography
                                variant="body1"
                                sx={{
                                  fontWeight: 'bold',
                                  color: transaction.type === 'income' ? 'lightgreen' : 'error.main',
                                }}
                              >
                                {transaction.type === 'expense' ? '-' : ''}R$ {Math.abs(transaction.amount).toFixed(2).replace('.', ',')}
                              </Typography>
                            </Box>
                          }
                          secondary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                              <Chip
                                label={transaction.category}
                                size="small"
                                sx={{
                                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                                  color: 'white',
                                  fontWeight: 'bold',
                                }}
                              />
                              <Typography variant="caption" sx={{ color: 'text.disabled' }}>
                                {new Date(transaction.date).toLocaleDateString('pt-BR')}
                              </Typography>
                            </Box>
                          }
                          primaryTypographyProps={{ style: { color: 'white' } }}
                          secondaryTypographyProps={{ style: { color: 'rgba(255, 255, 255, 0.7)' } }}
                        />
                      </ListItem>
                      {index < recentTransactions.length - 1 && <Divider component="li" sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.3)' }} />}
                    </React.Fragment>
                  ))}
                </List>
                <Button variant="outlined" color="primary" sx={{ mt: 2, width: '100%' }}>
                  Ver todas as transações
                </Button>
              </CardContent>
            </Card>

            <Button
              variant="contained"
              color="secondary"
              onClick={handleLogout}
              sx={{ mt: 2 }}
            >
              Sair
            </Button>
          </>
        )}
      </Container>
    </Box>
  );
};

export default DashboardPage;