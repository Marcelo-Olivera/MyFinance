// src/components/TransactionFormModal/index.tsx
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
// ✅ CORREÇÃO: Importa 'Resolver' como type-only
import { useForm, type SubmitHandler, type Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { TransactionType } from '../../enums/transaction-type.enum';
import type { TransactionData } from '../../interfaces/transaction.interface';
import type { CategoryData } from '../../interfaces/category.interface';

const API_BASE_URL = 'http://localhost:3000';

// Interface de props para o modal
interface TransactionFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  transactionToEdit?: TransactionData;
}

// Esquema de validação com Yup
const schema = yup.object({
  amount: yup.number()
    .typeError('Valor deve ser um número')
    .positive('Valor deve ser positivo')
    .required('Valor é obrigatório'),
  description: yup.string()
    .required('Descrição é obrigatória')
    .max(100, 'Descrição deve ter no máximo 100 caracteres.'),
  date: yup.string()
    .required('Data é obrigatória')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Formato de data inválido (AAAA-MM-DD)'),
  type: yup.string()
    .oneOf([TransactionType.INCOME, TransactionType.EXPENSE], 'Tipo inválido')
    .required('Tipo é obrigatório'),
  categoryId: yup.number()
    .nullable()
    .transform((value) => (isNaN(value) || value === '' ? null : value))
    .notRequired(),
  notes: yup.string()
    .nullable()
    .max(255, 'Notas devem ter no máximo 255 caracteres.')
    .notRequired(),
}).required();

const TransactionFormModal: React.FC<TransactionFormModalProps> = ({
  open,
  onClose,
  onSuccess,
  transactionToEdit,
}) => {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorCategories, setErrorCategories] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<TransactionData>({
    resolver: yupResolver(schema) as unknown as Resolver<TransactionData, any>,
  });

  const selectedType = watch('type');
  const isEditing = !!transactionToEdit;

  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      setErrorCategories(null);
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('Token de acesso não encontrado.');
        }
        const response = await axios.get<CategoryData[]>(`${API_BASE_URL}/categories`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        setCategories(response.data);
      } catch (err: any) {
        console.error('Erro ao buscar categorias para o modal:', err);
        setErrorCategories(err.response?.data?.message || 'Erro ao carregar categorias.');
      } finally {
        setLoadingCategories(false);
      }
    };

    if (open) {
      fetchCategories();
    }
  }, [open]);

  useEffect(() => {
    if (isEditing && transactionToEdit) {
      setValue('amount', transactionToEdit.amount);
      setValue('description', transactionToEdit.description);
      setValue('date', transactionToEdit.date);
      setValue('type', transactionToEdit.type);
      setValue('categoryId', transactionToEdit.categoryId ?? null);
      setValue('notes', transactionToEdit.notes ?? null);
    } else {
      reset({
        amount: undefined,
        description: '',
        date: new Date().toISOString().split('T')[0],
        type: TransactionType.EXPENSE,
        categoryId: null,
        notes: null,
      });
    }
  }, [isEditing, transactionToEdit, reset, setValue]);

  const onSubmit: SubmitHandler<TransactionData> = async (data) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        alert('Sua sessão expirou. Faça login novamente.');
        onClose();
        return;
      }

      const payload: Partial<TransactionData> = { ...data };

      if (payload.categoryId === null || payload.categoryId === undefined) {
        delete payload.categoryId;
      }
      if (payload.notes === null || payload.notes === undefined) {
        delete payload.notes;
      }

      if (isEditing) {
        await axios.patch(`${API_BASE_URL}/transactions/${transactionToEdit?.id}`, payload, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        alert('Transação atualizada com sucesso!');
      } else {
        await axios.post(`${API_BASE_URL}/transactions`, payload, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        alert('Transação adicionada com sucesso!');
      }

      onSuccess();
      onClose();
      reset();
    } catch (error: any) {
      console.error('Erro ao salvar transação:', error);
      const errorMessage = error.response?.data?.message || 'Ocorreu um erro ao salvar a transação.';
      alert(errorMessage);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(10px)',
          color: 'text.primary',
          borderRadius: 2,
          boxShadow: 3,
        },
      }}
    >
      <DialogTitle sx={{ color: '#0D47A1', fontWeight: 'bold' }}>
        {isEditing ? 'Editar Transação' : 'Adicionar Nova Transação'}
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent>
          {/* Campo de Valor */}
          <TextField
            autoFocus
            margin="dense"
            id="amount"
            label="Valor"
            type="number"
            fullWidth
            variant="outlined"
            {...register('amount')}
            error={!!errors.amount}
            helperText={errors.amount?.message}
            InputLabelProps={{ sx: { color: '#0D47A1' } }}
            InputProps={{
              sx: { color: '#0D47A1', '&::placeholder': { color: 'rgba(13, 71, 161, 0.7)' } },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#0D47A1' },
                '&:hover fieldset': { borderColor: '#0D47A1' },
                '&.Mui-focused fieldset': { borderColor: '#0D47A1' },
              },
              '& .MuiFormHelperText-root': { color: '#0D47A1' },
            }}
          />

          {/* Campo de Descrição */}
          <TextField
            margin="dense"
            id="description"
            label="Descrição"
            type="text"
            fullWidth
            variant="outlined"
            {...register('description')}
            error={!!errors.description}
            helperText={errors.description?.message}
            InputLabelProps={{ sx: { color: '#0D47A1' } }}
            InputProps={{
              sx: { color: '#0D47A1', '&::placeholder': { color: 'rgba(13, 71, 161, 0.7)' } },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#0D47A1' },
                '&:hover fieldset': { borderColor: '#0D47A1' },
                '&.Mui-focused fieldset': { borderColor: '#0D47A1' },
              },
              '& .MuiFormHelperText-root': { color: '#0D47A1' },
            }}
          />

          {/* Campo de Data */}
          <TextField
            margin="dense"
            id="date"
            label="Data"
            type="date"
            fullWidth
            variant="outlined"
            InputLabelProps={{ shrink: true, sx: { color: '#0D47A1' } }}
            InputProps={{
              sx: { color: '#0D47A1', '&::placeholder': { color: 'rgba(13, 71, 161, 0.7)' } },
            }}
            {...register('date')}
            error={!!errors.date}
            helperText={errors.date?.message}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#0D47A1' },
                '&:hover fieldset': { borderColor: '#0D47A1' },
                '&.Mui-focused fieldset': { borderColor: '#0D47A1' },
              },
              '& .MuiFormHelperText-root': { color: '#0D47A1' },
            }}
          />

          {/* Campo de Tipo (Receita/Despesa) */}
          <FormControl component="fieldset" margin="dense" fullWidth sx={{ mt: 2, mb: 1 }}>
            <FormLabel sx={{ color: '#0D47A1' }} component="legend">Tipo de Transação</FormLabel>
            <RadioGroup
              row
              aria-label="Tipo de Transação"
              {...register('type')}
              value={selectedType}
              onChange={(e) => setValue('type', e.target.value as TransactionType)}
            >
              <FormControlLabel
                value={TransactionType.INCOME}
                control={<Radio sx={{ color: 'lightgreen', '&.Mui-checked': { color: 'lightgreen' } }} />}
                label="Receita"
              />
              <FormControlLabel
                value={TransactionType.EXPENSE}
                control={<Radio sx={{ color: 'red', '&.Mui-checked': { color: 'red' } }} />}
                label="Despesa"
              />
            </RadioGroup>
            {errors.type && (
              <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                {errors.type.message}
              </Typography>
            )}
          </FormControl>

          {/* Campo de Categoria */}
          <FormControl fullWidth margin="dense" sx={{ mt: 2, mb: 1 }}>
            <InputLabel sx={{ color: '#0D47A1' }}>Categoria (Opcional)</InputLabel>
            {loadingCategories ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <CircularProgress size={20} color="secondary" />
              </Box>
            ) : errorCategories ? (
              <Alert severity="error" sx={{ width: '100%' }}>
                {errorCategories}
              </Alert>
            ) : (
              <Select
                label="Categoria (Opcional)"
                {...register('categoryId')}
                value={watch('categoryId') ?? ''}
                onChange={(e) => setValue('categoryId', e.target.value as number | null)}
                sx={{
                  color: '#0D47A1',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#0D47A1' },
                  '& .MuiSvgIcon-root': { color: '#0D47A1' },
                }}
                MenuProps={{
                  PaperProps: {
                    sx: {
                      backgroundColor: 'rgba(0, 0, 0, 0.9)',
                      color: 'white',
                    },
                  },
                }}
              >
                <MenuItem value={''}>Nenhuma</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    <Chip label={category.name} size="small" sx={{ backgroundColor: category.color || 'gray', color: 'white' }} />
                  </MenuItem>
                ))}
              </Select>
            )}
            {errors.categoryId && (
              <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                {errors.categoryId.message}
              </Typography>
            )}
          </FormControl>

          {/* Campo de Notas */}
          <TextField
            margin="dense"
            id="notes"
            label="Notas (Opcional)"
            type="text"
            fullWidth
            multiline
            rows={2}
            variant="outlined"
            {...register('notes')}
            error={!!errors.notes}
            helperText={errors.notes?.message}
            InputLabelProps={{ sx: { color: '#0D47A1' } }}
            InputProps={{
              sx: { color: '#0D47A1', '&::placeholder': { color: 'rgba(13, 71, 161, 0.7)' } },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#0D47A1' },
                '&:hover fieldset': { borderColor: '#0D47A1' },
                '&.Mui-focused fieldset': { borderColor: '#0D47A1' },
              },
              '& .MuiFormHelperText-root': { color: '#0D47A1' },
            }}
          />

        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary" sx={{ color: '#0D47A1' }}>
            Cancelar
          </Button>
          <Button type="submit" color="primary" sx={{ color: '#0D47A1' }}>
            {isEditing ? 'Salvar Alterações' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default TransactionFormModal;