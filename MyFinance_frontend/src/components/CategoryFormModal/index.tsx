// src/components/CategoryFormModal/index.tsx
import React, { useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Typography } from '@mui/material'; // Adicionado Typography para erro do campo color
import { useForm, type SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

interface CategoryFormModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  categoryToEdit?: CategoryData;
}

interface CategoryData {
  id?: number;
  name: string;
  color: string | null; // aceita null se não for informado
}

// CORES PREDEFINIDAS PARA SELEÇÃO
const predefinedColors = [
  '#00BCD4', // Ciano (azul/verde claro)
  '#4CAF50', // Verde vibrante
  '#FFC107', // Amarelo (dourado)
  '#2196F3', // Azul padrão
  '#FF9800', // Laranja
  '#9C27B0', // Roxo
  '#F44336', // Vermelho
  '#607D8B', // Azul Acinzentado
  '#008080', // Teal
  '#FFFFFF', // Branco (para opção transparente ou neutra)
  '#000000', // Preto (para opção transparente ou neutra)
];

const schema = yup.object({
  name: yup.string()
    .required('Nome é obrigatório')
    .max(50, 'Nome deve ter no máximo 50 caracteres.'),
  color: yup.string()
    .transform((value) => (value === '' ? undefined : value))
    .matches(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Cor inválida (ex: #RRGGBB ou #RGB)')
    .notRequired()
    .default(''), // <-- força valor padrão
}).required(); 

const CategoryFormModal: React.FC<CategoryFormModalProps> = ({ open, onClose, onSuccess, categoryToEdit }) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<CategoryData>({
    resolver: yupResolver(schema),
  });

  const selectedColor = watch('color'); // Observa o valor atual do campo 'color'

  const isEditing = !!categoryToEdit;

  useEffect(() => {
    if (isEditing && categoryToEdit) {
      setValue('name', categoryToEdit.name);
      setValue('color', categoryToEdit.color || '');
    } else {
      reset({ name: '', color: '' });
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
      if (payload.color === '') {
        delete payload.color;
      } else if (payload.color === null) {
        // Se null for um valor aceitável para o backend, pode deixar.
        // Se o backend espera undefined para "sem cor", delete também.
        // delete payload.color;
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
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{color: '#0D47A1', fontWeight: 'bold'}}>{isEditing ? 'Editar Categoria' : 'Adicionar Nova Categoria'}</DialogTitle>
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
            InputLabelProps={{ sx: { color: '#0D47A1' } }} // Azul escuro para o rótulo
            inputProps={{ sx: { color: '#0D47A1' } }} // Azul escuro para o texto do campo
          />

          <FormControl component="fieldset" margin="dense" fullWidth sx={{ mt: 2, mb: 1 }}>
            <FormLabel sx={{color: '#0D47A1'}} component="legend">Selecione uma Cor (Opcional)</FormLabel>
            <RadioGroup
              row
              aria-label="Cor da Categoria"
              name="color"
              value={selectedColor || ''}
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
                        '&.Mui-checked': {
                          color: colorValue,
                        },
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
                        border: selectedColor === colorValue ? '2px solid blue' : '1px solid gray', // Azul para destaque na cor selecionada
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
          <Button onClick={onClose} color="secondary">
            Cancelar
          </Button>
          <Button type="submit" color="primary">
            {isEditing ? 'Salvar Alterações' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default CategoryFormModal;

