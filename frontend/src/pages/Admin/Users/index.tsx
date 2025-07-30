// src/pages/Admin/Users/index.tsx
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Container, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, IconButton, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete'; // Ícone para o botão de deletar
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; // URL do seu backend NestJS

// Interface para o tipo de usuário que esperamos do backend
interface UserData {
  id: number;
  email: string;
  role: string; // O papel do usuário (ADMIN ou USER)
}

const AdminUsersPage: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserData[]>([]); // Estado para armazenar a lista de usuários
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // Para mensagens de sucesso

  // Função para buscar a lista de usuários do backend
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null); // Limpa mensagens de sucesso ao recarregar
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Token de acesso não encontrado. Faça login.');
      }

      const response = await axios.get<UserData[]>(`${API_BASE_URL}/users`, {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Envia o token
        },
      });

      setUsers(response.data);
    } catch (err: any) {
      console.error('Erro ao buscar usuários:', err);
      if (err.response && err.response.status === 401) {
        // Token inválido ou expirado
        alert('Sua sessão expirou ou é inválida. Por favor, faça login novamente.');
        localStorage.removeItem('accessToken');
        navigate('/login');
      } else if (err.response && err.response.status === 403) {
        // Não autorizado (não é ADMIN)
        alert('Você não tem permissão para acessar esta página.');
        navigate('/dashboard'); // Redireciona para o dashboard ou login
      } else {
        setError(err.response?.data?.message || 'Erro ao carregar lista de usuários.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Função para deletar um usuário
  const handleDeleteUser = async (userId: number) => {
    if (!window.confirm(`Tem certeza que deseja excluir o usuário com ID ${userId}?`)) {
      return; // Cancela se o usuário não confirmar
    }

    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Token de acesso não encontrado.');
      }

      await axios.delete(`${API_BASE_URL}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setSuccessMessage(`Usuário com ID ${userId} excluído com sucesso!`);
      fetchUsers(); // Recarrega a lista de usuários após a exclusão
    } catch (err: any) {
      console.error('Erro ao excluir usuário:', err);
      setError(err.response?.data?.message || 'Erro ao excluir usuário.');
    }
  };

  // Carrega os usuários ao montar o componente
  useEffect(() => {
    fetchUsers();
  }, []); // Array de dependências vazio para rodar apenas uma vez na montagem

  const handleGoToHome = () => {
    navigate('/home');
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
          backgroundColor: 'rgba(0, 0, 0, 0.7)', // Fundo um pouco mais escuro para o admin
          backdropFilter: 'blur(5px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
          Painel de Administração de Usuários
        </Typography>

        {successMessage && (
          <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
            {successMessage}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
            <CircularProgress color="secondary" />
            <Typography variant="h6" sx={{ mt: 2, color: 'white' }}>Carregando usuários...</Typography>
          </Box>
        ) : error ? (
          <Box sx={{ py: 4 }}>
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
            <Button variant="contained" onClick={handleGoToHome} sx={{ mt: 2 }}>
              Voltar para o Dashboard
            </Button>
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ mb: 4, backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white' }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Email</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Papel</TableCell>
                  <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow
                    key={user.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row" sx={{ color: 'white' }}>
                      {user.id}
                    </TableCell>
                    <TableCell sx={{ color: 'white' }}>{user.email}</TableCell>
                    <TableCell sx={{ color: 'white' }}>{user.role}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        aria-label="delete"
                        color="error" // Cor vermelha para o botão de deletar
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={user.role === 'ADMIN'} // Desabilita o botão para usuários ADMIN (regra de negócio)
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleGoToHome}
          >
            Voltar para a Página Inicial
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default AdminUsersPage;