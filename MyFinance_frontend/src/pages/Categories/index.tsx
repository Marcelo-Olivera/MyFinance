// src/pages/Categories/index.tsx
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
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CategoryFormModal from '../../components/CategoryFormModal';
import type { CategoryData } from '../../interfaces/category.interface'// Importa a interface de categoria


const API_BASE_URL = 'http://localhost:3000';



const CategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // --- NOVOS ESTADOS PARA O MODAL ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState<CategoryData | undefined>(undefined);
  // --- FIM DOS NOVOS ESTADOS ---


  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Token de acesso não encontrado. Faça login.');
      }

      const response = await axios.get<CategoryData[]>(`${API_BASE_URL}/categories`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setCategories(response.data);
    } catch (err: any) {
      console.error('Erro ao buscar categorias:', err);
      if (err.response && err.response.status === 401) {
        alert('Sua sessão expirou ou é inválida. Por favor, faça login novamente.');
        localStorage.removeItem('accessToken');
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Erro ao carregar categorias.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = () => {
    setCategoryToEdit(undefined); // Garante que não estamos no modo de edição
    setIsModalOpen(true);        // Abre o modal
  };

  const handleEditCategory = (category: CategoryData) => { // Recebe o objeto categoria para edição
    setCategoryToEdit(category); // Define a categoria a ser editada
    setIsModalOpen(true);        // Abre o modal
  };

  const handleDeleteCategory = async (categoryId: number) => {
    if (!window.confirm(`Tem certeza que deseja excluir a categoria com ID ${categoryId}?`)) {
      return;
    }
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
          throw new Error('Token de acesso não encontrado.');
      }
      await axios.delete(`${API_BASE_URL}/categories/${categoryId}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setSuccessMessage('Categoria excluída com sucesso!');
      fetchCategories();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao excluir categoria.');
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

  const handleModalClose = () => {
    setIsModalOpen(false); // Função para fechar o modal
    setCategoryToEdit(undefined); // Limpa a categoria de edição ao fechar
  };

  const handleModalSuccess = () => {
    setSuccessMessage('Operação de categoria realizada com sucesso!'); // Define uma mensagem de sucesso
    fetchCategories(); // Recarrega a lista após adição/edição
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
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
          Gerenciar Categorias
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

        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
            <CircularProgress color="secondary" />
            <Typography variant="h6" sx={{ mt: 2, color: 'white' }}>Carregando categorias...</Typography>
          </Box>
        ) : (
          <>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddCategory} // Chama a função para abrir o modal
              sx={{ mb: 3, alignSelf: 'flex-end' }}
            >
              Adicionar Nova Categoria
            </Button>

            {categories.length === 0 ? (
              <Typography variant="h6" sx={{ color: 'white', mt: 3, mb: 3 }}>
                Nenhuma categoria encontrada. Comece adicionando uma!
              </Typography>
            ) : (
              <TableContainer component={Paper} sx={{ mb: 4, backgroundColor: 'rgba(255, 255, 255, 0.1)', color: 'white' }}>
                <Table sx={{ minWidth: 650 }} aria-label="categories table">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nome</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Cor</TableCell>
                      <TableCell align="right" sx={{ color: 'white', fontWeight: 'bold' }}>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {categories.map((category) => (
                      <TableRow
                        key={category.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                      >
                        <TableCell component="th" scope="row" sx={{ color: 'white' }}>
                          {category.id}
                        </TableCell>
                        <TableCell sx={{ color: 'white' }}>{category.name}</TableCell>
                        <TableCell sx={{ color: 'white' }}>
                          {category.color ? (
                            <Chip
                              label={category.color}
                              sx={{ backgroundColor: category.color, color: 'white', fontWeight: 'bold' }}
                            />
                          ) : (
                            "N/A"
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            aria-label="edit"
                            color="info"
                            onClick={() => handleEditCategory(category)} // Passa o objeto categoria para edição
                            sx={{ mr: 1 }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            aria-label="delete"
                            color="error"
                            onClick={() => {
                              if (category.id !== undefined) { // <-- VERIFICAÇÃO AQUI
                                handleDeleteCategory(category.id);
                              } else {
                                // Caso o ID seja undefined (o que não deveria acontecer para itens na lista)
                                console.error("Erro: ID da categoria não encontrado para exclusão.");
                                setError("Não foi possível excluir a categoria: ID inválido.");
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
          </>
        )}

        <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleGoToDashboard}
            sx={{ width: '100%' }}
          >
            Voltar para o Dashboard
          </Button>
        </Box>
      </Container>

      {/* --- Renderiza o CategoryFormModal --- */}
      <CategoryFormModal
        open={isModalOpen}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        categoryToEdit={categoryToEdit} // Passa a categoria a ser editada (undefined para adicionar)
      />
      {/* --- Fim da Renderização do CategoryFormModal --- */}

    </Box>
  );
};

export default CategoriesPage;