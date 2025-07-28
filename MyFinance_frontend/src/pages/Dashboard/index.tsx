// src/pages/Dashboard/index.tsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  CircularProgress,
  Alert,
  Paper,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const API_BASE_URL = 'http://localhost:3000';

// Cores para os gráficos - você pode personalizar!
const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF19A3', '#19FFD4', '#FFD419',
  '#8A2BE2', '#7FFF00', '#DC143C', '#00FFFF', '#00008B', '#006400', '#8B0000', '#FFD700'
];

// Interface para os dados agregados por categoria
interface CategorySummary {
  categoryName: string;
  amount: number;
  categoryColor?: string; // Opcional, vindo do backend
}

interface DashboardData {
  incomeByCategory: CategorySummary[];
  expenseByCategory: CategorySummary[];
}

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // NOVOS ESTADOS PARA OS FILTROS DE DATA
  const [filterStartDate, setFilterStartDate] = useState<string>('');
  const [filterEndDate, setFilterEndDate] = useState<string>('');

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Token de acesso não encontrado. Faça login.');
      }

      const queryParams = new URLSearchParams();
      if (filterStartDate) queryParams.append('startDate', filterStartDate);
      if (filterEndDate) queryParams.append('endDate', filterEndDate);

      const response = await axios.get<DashboardData>(`${API_BASE_URL}/transactions/summary-by-category?${queryParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setDashboardData(response.data);
    } catch (err: any) {
      console.error('Erro ao buscar dados do dashboard:', err);
      if (err.response && err.response.status === 401) {
        alert('Sua sessão expirou ou é inválida. Por favor, faça login novamente.');
        localStorage.removeItem('accessToken');
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Erro ao carregar dados do dashboard.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [filterStartDate, filterEndDate]);

  const handleGoToHome = () => {
    navigate('/home');
  };

  const renderCustomizedLabel = (props: { percent?: number; value?: number; name?: string }): string => {
    const { percent } = props;
    if (percent === undefined) return '';
    return `${(percent * 100).toFixed(0)}%`;
  };

  const formatTooltipValue = (value: number): string => {
    return `R$ ${value.toFixed(2).replace('.', ',')}`;
  };

  // ✅ NOVO: Função para formatar valores em moeda
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // ✅ REMOVIDO: getConsolidatedCategoryData não é mais necessário

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
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold' }}>
          Dashboard Financeiro
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* NOVOS FILTROS DE DATA */}
        <Box sx={{ width: '100%', mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
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
        {/* --- FIM FILTROS DE DATA --- */}

        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
            <CircularProgress color="secondary" />
            <Typography variant="h6" sx={{ mt: 2, color: 'white' }}>Carregando dados do dashboard...</Typography>
          </Box>
        ) : dashboardData && (dashboardData.incomeByCategory.length > 0 || dashboardData.expenseByCategory.length > 0) ? (
          <>
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 4,
                width: '100%',
                justifyContent: 'center',
                mb: 4, // Espaçamento entre os gráficos e as novas tabelas
              }}
            >
              {/* Gráfico de Receitas por Categoria */}
              <Box
                sx={{
                  flex: '1 1 calc(50% - 32px)',
                  maxWidth: 'calc(50% - 32px)',
                  minWidth: { xs: '100%', md: 'calc(50% - 32px)' },
                  boxSizing: 'border-box',
                }}
              >
                <Paper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white', borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
                    Receitas por Categoria
                  </Typography>
                  {dashboardData.incomeByCategory.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={dashboardData.incomeByCategory}
                          dataKey="amount"
                          nameKey="categoryName"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          labelLine={false}
                          label={renderCustomizedLabel}
                        >
                          {dashboardData.incomeByCategory.map((entry, index) => (
                            <Cell key={`cell-income-${index}`} fill={entry.categoryColor || COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={formatTooltipValue} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <Typography align="center" sx={{ mt: 2, color: 'rgba(255, 255, 255, 0.7)' }}>
                      Nenhuma receita registrada por categoria.
                    </Typography>
                  )}
                </Paper>
              </Box>

              {/* Gráfico de Despesas por Categoria */}
              <Box
                sx={{
                  flex: '1 1 calc(50% - 32px)',
                  maxWidth: 'calc(50% - 32px)',
                  minWidth: { xs: '100%', md: 'calc(50% - 32px)' },
                  boxSizing: 'border-box',
                }}
              >
                <Paper sx={{ p: 2, backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white', borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom align="center" sx={{ fontWeight: 'bold' }}>
                    Despesas por Categoria
                  </Typography>
                  {dashboardData.expenseByCategory.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={dashboardData.expenseByCategory}
                          dataKey="amount"
                          nameKey="categoryName"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#82ca9d"
                          labelLine={false}
                          label={renderCustomizedLabel}
                        >
                          {dashboardData.expenseByCategory.map((entry, index) => (
                            <Cell key={`cell-expense-${index}`} fill={entry.categoryColor || COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={formatTooltipValue} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <Typography align="center" sx={{ mt: 2, color: 'rgba(255, 255, 255, 0.7)' }}>
                      Nenhuma despesa registrada por categoria.
                    </Typography>
                  )}
                </Paper>
              </Box>
            </Box>

            {/* ✅ NOVA SEÇÃO: Duas Tabelas de Resumo por Categoria (Receitas e Despesas) */}
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 4, // Espaçamento entre as duas tabelas
                width: '100%',
                justifyContent: 'center',
                mt: 4, // Espaçamento acima das tabelas
              }}
            >
              {/* Tabela de Receitas por Categoria */}
              <Box
                sx={{
                  flex: '1 1 calc(50% - 32px)', // 2 tabelas por linha no desktop
                  maxWidth: 'calc(50% - 32px)',
                  minWidth: { xs: '100%', md: 'calc(50% - 32px)' },
                  boxSizing: 'border-box',
                }}
              >
                <Typography variant="h6" component="h3" gutterBottom sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}>
                  Total de Receitas por Categoria
                </Typography>
                {dashboardData.incomeByCategory.length > 0 ? (
                  <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white' }}>
                    <Table aria-label="income by category table">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Categoria</TableCell>
                          <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Valor</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {dashboardData.incomeByCategory.map((row, index) => (
                          <TableRow
                            key={row.categoryName}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell component="th" scope="row" sx={{ color: 'white' }}>
                              <Chip
                                label={row.categoryName}
                                size="small"
                                sx={{ backgroundColor: row.categoryColor || 'gray', color: 'white' }}
                              />
                            </TableCell>
                            <TableCell align="right" sx={{ color: 'lightgreen', fontWeight: 'bold' }}>
                              {formatCurrency(row.amount)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography align="center" sx={{ mt: 2, color: 'rgba(255, 255, 255, 0.7)' }}>
                    Nenhuma receita registrada por categoria.
                  </Typography>
                )}
              </Box>

              {/* Tabela de Despesas por Categoria */}
              <Box
                sx={{
                  flex: '1 1 calc(50% - 32px)', // 2 tabelas por linha no desktop
                  maxWidth: 'calc(50% - 32px)',
                  minWidth: { xs: '100%', md: 'calc(50% - 32px)' },
                  boxSizing: 'border-box',
                }}
              >
                <Typography variant="h6" component="h3" gutterBottom sx={{ mb: 2, fontWeight: 'bold', textAlign: 'center' }}>
                  Total de Despesas por Categoria
                </Typography>
                {dashboardData.expenseByCategory.length > 0 ? (
                  <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white' }}>
                    <Table aria-label="expense by category table">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Categoria</TableCell>
                          <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Valor</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {dashboardData.expenseByCategory.map((row, index) => (
                          <TableRow
                            key={row.categoryName}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell component="th" scope="row" sx={{ color: 'white' }}>
                              <Chip
                                label={row.categoryName}
                                size="small"
                                sx={{ backgroundColor: row.categoryColor || 'gray', color: 'white' }}
                              />
                            </TableCell>
                            <TableCell align="right" sx={{ color: 'red', fontWeight: 'bold' }}>
                              {formatCurrency(row.amount)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography align="center" sx={{ mt: 2, color: 'rgba(255, 255, 255, 0.7)' }}>
                    Nenhuma despesa registrada por categoria.
                  </Typography>
                )}
              </Box>
            </Box>
            {/* --- FIM NOVA SEÇÃO: Duas Tabelas de Resumo por Categoria --- */}
          </>
        ) : (
          <Typography variant="h6" sx={{ color: 'white', mt: 3, mb: 3 }}>
            Nenhum dado de transação encontrado para exibir no dashboard.
          </Typography>
        )}

        <Box sx={{ mt: 4, width: '100%', display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleGoToHome}
          >
            Voltar para Página Inicial
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default DashboardPage;