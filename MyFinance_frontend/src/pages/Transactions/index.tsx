// src/pages/Transactions/index.tsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  IconButton,
  Alert,
  Chip,
  FormControl, // Adicionado para filtros
  InputLabel, // Adicionado para filtros
  Select,      // Adicionado para filtros
  MenuItem,    // Adicionado para filtros
  TextField,   // Adicionado para filtros de data
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TransactionType } from '../../enums/transaction-type.enum'; // Importa o enum
import type { TransactionData } from '../../interfaces/transaction.interface'; // Importa o tipo da transação
import type { CategoryData } from '../../interfaces/category.interface'; // Importa o tipo da categoria

const API_BASE_URL = 'http://localhost:3000'; // URL do backend

const TransactionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]); // Para o filtro de categoria
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // --- ESTADOS PARA OS FILTROS ---
  const [filterType, setFilterType] = useState<string>(''); // 'income', 'expense', ou '' para todos
  const [filterCategory, setFilterCategory] = useState<number | string>(''); // categoryId ou '' para todos
  const [filterStartDate, setFilterStartDate] = useState<string>(''); // AAAA-MM-DD
  const [filterEndDate, setFilterEndDate] = useState<string>('');     // AAAA-MM-DD
  // --- FIM ESTADOS PARA OS FILTROS ---

  // Função principal para buscar transações (agora com filtros)
  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Token de acesso não encontrado. Faça login.');
      }

      // Constrói os parâmetros de query para a API
      const queryParams = new URLSearchParams();
      if (filterType) queryParams.append('type', filterType);
      if (filterCategory) queryParams.append('categoryId', filterCategory.toString());
      if (filterStartDate) queryParams.append('startDate', filterStartDate);
      if (filterEndDate) queryParams.append('endDate', filterEndDate);

      const response = await axios.get<TransactionData[]>(`${API_BASE_URL}/transactions?${queryParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setTransactions(response.data);
    } catch (err: any) {
      console.error('Erro ao buscar transações:', err);
      if (err.response && err.response.status === 401) {
        alert('Sua sessão expirou ou é inválida. Por favor, faça login novamente.');
        localStorage.removeItem('accessToken');
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Erro ao carregar transações.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Função para buscar categorias (para o filtro de categoria)
  const fetchCategoriesForFilter = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        // Este erro será tratado pelo fetchTransactions principal se não houver token
        return;
      }
      const response = await axios.get<CategoryData[]>(`${API_BASE_URL}/categories`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setCategories(response.data);
    } catch (err) {
      console.error('Erro ao buscar categorias para filtro:', err);
      // Não define erro global para não bloquear o carregamento de transações
    }
  };

  // Carrega transações e categorias ao montar o componente ou quando filtros mudam
  useEffect(() => {
    fetchTransactions();
  }, [filterType, filterCategory, filterStartDate, filterEndDate]); // Recarrega sempre que um filtro muda

  useEffect(() => {
    fetchCategoriesForFilter(); // Carrega categorias uma vez ao montar
  }, []);

  const handleAddTransaction = () => {
    // TODO: Abrir modal ou navegar para formulário de adição
    alert('Funcionalidade de adicionar transação será implementada em breve!');
  };

  const handleEditTransaction = (transactionId: number) => {
    // TODO: Abrir modal ou navegar para formulário de edição
    alert(`Funcionalidade de editar transação ${transactionId} será implementada em breve!`);
  };

  const handleDeleteTransaction = async (transactionId: number) => {
    if (!window.confirm(`Tem certeza que deseja excluir a transação com ID ${transactionId}?`)) {
      return;
    }
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Token de acesso não encontrado.');
      }
      await axios.delete(`${API_BASE_URL}/transactions/${transactionId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setSuccessMessage('Transação excluída com sucesso!');
      fetchTransactions(); // Recarrega a lista
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao excluir transação.');
      if (err.response && err.response.status === 401) {
        alert('Sua sessão expirou ou é inválida. Por favor, faça login novamente.');
        localStorage.removeItem('accessToken');
        navigate('/login');
      }
    }
  };

  const handleGoToDashboard = () => {
    navigate('/dashboard');
  };

  const handleGoToCategories = () => {
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
        color: 'text.primary', // Cor do texto principal do tema
      }}
    >
      <Container
        component="main"
        maxWidth="lg" // Aumentado para 'lg' para acomodar a tabela de transações
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
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
          Minhas Transações
        </Typography>

        {successMessage && (
          <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
            {successMessage}
          </Alert>
        )}
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* --- FILTROS --- */}
        <Box sx={{ width: '100%', mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel sx={{ color: 'text.primary' }}>Tipo</InputLabel>
            <Select
              value={filterType}
              label="Tipo"
              onChange={(e) => setFilterType(e.target.value as string)}
              sx={{ color: 'text.primary', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'text.secondary' }, '& .MuiSvgIcon-root': { color: 'text.secondary' } }}
            >
              <MenuItem sx={{color: '#000'}} value="">Todos</MenuItem>
              <MenuItem sx={{color: '#000'}} value={TransactionType.INCOME}>Receita</MenuItem>
              <MenuItem sx={{color: '#000'}} value={TransactionType.EXPENSE}>Despesa</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel sx={{ color: 'text.primary' }}>Categoria</InputLabel>
            <Select
              value={filterCategory}
              label="Categoria"
              onChange={(e) => setFilterCategory(e.target.value as number)}
              sx={{ color: 'text.primary', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'text.secondary' }, '& .MuiSvgIcon-root': { color: 'text.secondary' } }}
            >
              <MenuItem sx={{color: '#000'}} value="">Todas</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  <Chip label={cat.name} size="small" sx={{ backgroundColor: cat.color || 'gray', color: 'white' }} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Data Inicial"
            type="date"
            value={filterStartDate}
            onChange={(e) => setFilterStartDate(e.target.value)}
            InputLabelProps={{
              shrink: true, sx: { color: 'text.primary' }
            }}
            InputProps={{
              sx: { color: 'text.primary', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'text.secondary' } }
            }}
            sx={{ '& .MuiSvgIcon-root': { color: 'text.secondary' } }}
          />
          <TextField
            label="Data Final"
            type="date"
            value={filterEndDate}
            onChange={(e) => setFilterEndDate(e.target.value)}
            InputLabelProps={{
              shrink: true, sx: { color: 'text.primary' }
            }}
            InputProps={{
              sx: { color: 'text.primary', '& .MuiOutlinedInput-notchedOutline': { borderColor: 'text.secondary' } }
            }}
            sx={{ '& .MuiSvgIcon-root': { color: 'text.secondary' } }}
          />
        </Box>
        {/* --- FIM FILTROS --- */}

        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
            <CircularProgress color="secondary" />
            <Typography variant="h6" sx={{ mt: 2, color: 'text.primary' }}>Carregando transações...</Typography>
          </Box>
        ) : transactions.length === 0 ? (
          <Typography variant="h6" sx={{ color: 'text.primary', mt: 3, mb: 3 }}>
            Nenhuma transação encontrada. Comece adicionando uma!
          </Typography>
        ) : (
          <TableContainer component={Paper} sx={{ mb: 4, backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'text.primary' }}>
            <Table sx={{ minWidth: 700 }} aria-label="transactions table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Data</TableCell>
                  <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Descrição</TableCell>
                  <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Categoria</TableCell>
                  <TableCell align="right" sx={{ color: 'text.primary', fontWeight: 'bold' }}>Valor</TableCell>
                  <TableCell sx={{ color: 'text.primary', fontWeight: 'bold' }}>Tipo</TableCell>
                  <TableCell align="right" sx={{ color: 'text.primary', fontWeight: 'bold' }}>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow
                    key={transaction.id}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component="th" scope="row" sx={{ color: 'text.primary' }}>
                      {new Date(transaction.date + 'T00:00:00').toLocaleDateString('pt-BR')} {/* Adicionado T00:00:00 para evitar problemas de fuso horário */}
                    </TableCell>
                    <TableCell sx={{ color: 'text.primary' }}>{transaction.description}</TableCell>
                    <TableCell sx={{ color: 'text.primary' }}>
                      {transaction.category ? (
                        <Chip
                          label={transaction.category.name}
                          size="small"
                          sx={{ backgroundColor: transaction.category.color || 'gray', color: 'white' }}
                        />
                      ) : (
                        "N/A"
                      )}
                    </TableCell>
                    <TableCell align="right" sx={{ color: transaction.type === TransactionType.INCOME ? 'lightgreen' : 'error.main', fontWeight: 'bold' }}>
                      {transaction.type === TransactionType.EXPENSE ? '-' : ''}R$ {transaction.amount.toFixed(2).replace('.', ',')}
                    </TableCell>
                    <TableCell sx={{ color: 'text.primary' }}>
                        <Chip
                            label={transaction.type === TransactionType.INCOME ? 'Receita' : 'Despesa'}
                            size="small"
                            sx={{ backgroundColor: transaction.type === TransactionType.INCOME ? 'green' : 'red', color: 'white' }}
                        />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        aria-label="edit"
                        color="info"
                        onClick={() => handleEditTransaction(transaction.id)}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        color="error"
                        onClick={() => handleDeleteTransaction(transaction.id)}
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

        <Box sx={{ display: 'flex', gap: 2, mt: 2, width: '100%', justifyContent: 'space-between' }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAddTransaction}
          >
            Adicionar Nova Transação
          </Button>
          <Box sx={{ display: 'flex', gap: 2 }}> {/* Grupo de botões de navegação */}
            <Button
              variant="outlined"
              color="info"
              onClick={handleGoToCategories}
            >
              Gerenciar Categorias
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleGoToDashboard}
            >
              Voltar para o Dashboard
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default TransactionsPage;