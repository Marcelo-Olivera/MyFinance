// src/components/CategoryFormModal/index.tsx
import React, { useEffect } from 'react';
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
} from '@mui/material';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import type { CategoryData } from '../../interfaces/category.interface';

// Definição da interface de props para o modal
interface CategoryFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categoryToEdit?: CategoryData; // Opcional para edição
}

const API_BASE_URL = import.meta.env.VITE_API_URL;


// CORES PREDEFINIDAS PARA SELEÇÃO
const predefinedColors = [
  '#00BCD4', '#4CAF50', '#FFC107', '#2196F3', '#FF9800',
  '#9C27B0', '#F44336', '#607D8B', '#008080', '#FFFFFF', '#000000',
];

// Schema com yup
const schema = yup.object({
  name: yup.string()
    .required('Nome é obrigatório')
    .max(50, 'Nome deve ter no máximo 50 caracteres.'),
  color: yup.string()
    .nullable() // ✅ permite null
    .transform((value) => (value === '' ? null : value)) // ✅ transforma '' em null
    .oneOf([...predefinedColors, null], 'Cor inválida. Selecione uma das opções ou deixe em branco.')
    .notRequired(), // ✅ opcional
}).required();

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({
  open,
  onClose,
  onSuccess,
  categoryToEdit,
}) => {
  const {
  register,
  handleSubmit,
  formState: { errors },
  reset,
  setValue,
  watch,
} = useForm({
  resolver: yupResolver(schema),
});


  const selectedColor = watch('color');
  const isEditing = !!categoryToEdit;

  useEffect(() => {
    if (isEditing && categoryToEdit) {
      setValue('name', categoryToEdit.name);
      setValue('color', categoryToEdit.color ?? ''); // ✅ se null/undefined, mostra ''
    } else {
      reset({ name: '', color: '' }); // ✅ limpa para novo
    }
  }, [isEditing, categoryToEdit, reset, setValue]);

  const onSubmit: SubmitHandler<CategoryData> = async (data) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        alert('Sua sessão expirou. Faça login novamente.');
        onClose();
        return;
      }

      const payload: Partial<CategoryData> = { ...data };

      // ✅ Remove color se for '' ou null
      if (!payload.color) {
        delete payload.color;
      }

      if (isEditing) {
        await axios.patch(`${API_BASE_URL}/categories/${categoryToEdit?.id}`, payload, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        alert('Categoria atualizada com sucesso!');
      } else {
        await axios.post(`${API_BASE_URL}/categories`, payload, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        alert('Categoria adicionada com sucesso!');
      }

      onSuccess();
      onClose();
      reset();
    } catch (error: any) {
      console.error('Erro ao salvar categoria:', error);
      const errorMessage = error.response?.data?.message || 'Ocorreu um erro ao salvar a categoria.';
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
        {isEditing ? 'Editar Categoria' : 'Adicionar Nova Categoria'}
      </DialogTitle>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Nome da Categoria"
            type="text"
            fullWidth
            variant="outlined"
            {...register('name')}
            error={!!errors.name}
            helperText={errors.name?.message}
            InputLabelProps={{ sx: { color: '#0D47A1' } }}
            InputProps={{
              sx: {
                color: '#0D47A1',
                '&::placeholder': { color: 'rgba(13, 71, 161, 0.7)' },
              },
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

          <FormControl component="fieldset" margin="dense" fullWidth sx={{ mt: 2, mb: 1 }}>
            <FormLabel sx={{ color: '#0D47A1' }} component="legend">Selecione uma Cor (Opcional)</FormLabel>
            <RadioGroup
              row
              aria-label="Cor da Categoria"
              name="color"
              value={selectedColor || ''} // ✅ mostra '' no RadioGroup se null/undefined
              onChange={(e) => setValue('color', e.target.value)}
            >
              {predefinedColors.map((colorValue) => (
                <FormControlLabel
                  key={colorValue}
                  value={colorValue}
                  control={
                    <Radio
                      sx={{
                        color: colorValue,
                        '&.Mui-checked': { color: colorValue },
                      }}
                    />
                  }
                  label={
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: colorValue,
                        border: selectedColor === colorValue ? '2px solid blue' : '1px solid gray',
                        boxShadow: '0px 0px 5px rgba(0,0,0,0.5)',
                      }}
                    />
                  }
                  labelPlacement="end"
                />
              ))}
            </RadioGroup>
            {errors.color && (
              <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                {errors.color.message}
              </Typography>
            )}
          </FormControl>
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

export default CategoryFormModal;
