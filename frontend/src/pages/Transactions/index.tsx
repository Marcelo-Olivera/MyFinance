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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TransactionType } from '../../enums/transaction-type.enum';
import type { TransactionData } from '../../interfaces/transaction.interface';
import type { CategoryData } from '../../interfaces/category.interface';
import TransactionFormModal from '../../components/TransactionFormModal'; // ✅ NOVO: Importa o modal de transações

const API_BASE_URL = import.meta.env.VITE_API_URL;

const TransactionsPage: React.FC = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // --- ESTADOS PARA OS FILTROS ---
  const [filterType, setFilterType] = useState<string>('');
  const [filterCategory, setFilterCategory] = useState<number | string>('');
  const [filterStartDate, setFilterStartDate] = useState<string>('');
  const [filterEndDate, setFilterEndDate] = useState<string>('');
  // --- FIM ESTADOS PARA OS FILTROS ---

  // ✅ NOVOS ESTADOS PARA O MODAL DE TRANSAÇÕES ---
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<TransactionData | undefined>(undefined);
  // --- FIM DOS NOVOS ESTADOS ---

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Token de acesso não encontrado. Faça login.');
      }

      const queryParams = new URLSearchParams();
      if (filterType) queryParams.append('type', filterType);
      if (typeof filterCategory === 'number') queryParams.append('categoryId', filterCategory.toString());
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

  const fetchCategoriesForFilter = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        return;
      }
      const response = await axios.get<CategoryData[]>(`${API_BASE_URL}/categories`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setCategories(response.data);
    } catch (err) {
      console.error('Erro ao buscar categorias para filtro:', err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filterType, filterCategory, filterStartDate, filterEndDate]);

  useEffect(() => {
    fetchCategoriesForFilter();
  }, []);

  // ✅ Funções para controlar o modal de transações
  const handleOpenTransactionModal = (transaction?: TransactionData) => {
    setTransactionToEdit(transaction); // Define a transação para edição (ou undefined para adicionar)
    setIsTransactionModalOpen(true); // Abre o modal
  };

  const handleCloseTransactionModal = () => {
    setIsTransactionModalOpen(false); // Fecha o modal
    setTransactionToEdit(undefined); // Limpa a transação de edição
  };

  const handleTransactionModalSuccess = () => {
    setSuccessMessage('Transação salva com sucesso!'); // Mensagem de sucesso
    fetchTransactions(); // Recarrega a lista de transações
  };

  // ✅ Modificado: Chama handleOpenTransactionModal sem argumentos para adicionar
  const handleAddTransaction = () => {
    handleOpenTransactionModal();
  };

  // ✅ Modificado: Recebe o objeto transaction completo para passar ao modal
  const handleEditTransaction = (transaction: TransactionData) => {
    handleOpenTransactionModal(transaction);
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
      fetchTransactions();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao excluir transação.');
      if (err.response && err.response.status === 401) {
        alert('Sua sessão expirou ou é inválida. Por favor, faça login novamente.');
        localStorage.removeItem('accessToken');
        navigate('/login');
      }
    }
  };

  const handleGoToHome = () => {
    navigate('/home');
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
        color: 'text.primary',
      }}
    >
      <Container
        component="main"
        maxWidth="lg"
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
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    color: 'white',
                  },
                },
              }}
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
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    color: 'white',
                  },
                },
              }}
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
                      {new Date(transaction.date + 'T00:00:00').toLocaleDateString('pt-BR')}
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
                        // ✅ Modificado: Passa o objeto transaction completo para o modal
                        onClick={() => {
                          if (transaction.id !== undefined) {
                            handleEditTransaction(transaction); // Passa o objeto completo
                          } else {
                            console.error("Erro: ID da transação é undefined na tentativa de edição.");
                            setError("Não foi possível editar a transação: ID inválido ou não encontrado.");
                          }
                        }}
                        sx={{ mr: 1 }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        color="error"
                        onClick={() => {
                          if (transaction.id !== undefined) {
                            handleDeleteTransaction(transaction.id);
                          } else {
                            console.error("Erro: ID da transação é undefined na tentativa de exclusão.");
                            setError("Não foi possível excluir a transação: ID inválido ou não encontrado.");
                          }
                        }}
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
            onClick={handleAddTransaction} // ✅ Chama handleAddTransaction para abrir o modal
          >
            Adicionar Nova Transação
          </Button>
          <Box sx={{ display: 'flex', gap: 2 }}>
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
              onClick={handleGoToHome}
            >
              Voltar para Página Inicial
            </Button>
          </Box>
        </Box>
      </Container>

      {/* ✅ NOVO: Renderiza o TransactionFormModal */}
      <TransactionFormModal
        open={isTransactionModalOpen}
        onClose={handleCloseTransactionModal}
        onSuccess={handleTransactionModalSuccess}
        transactionToEdit={transactionToEdit} // Passa a transação para edição (ou undefined para adicionar)
      />
      {/* --- Fim da Renderização do TransactionFormModal --- */}

    </Box>
  );
};

export default TransactionsPage;