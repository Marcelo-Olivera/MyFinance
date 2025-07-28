// src/pages/Registro/index.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button, TextField, Typography, Box, Container, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Importe o axios

// --- Defina a URL base do seu backend ---
const API_BASE_URL = 'http://localhost:3000'; // URL do seu backend NestJS

// Esquema de validação com Yup (mantido o mesmo)
const schema = yup.object({
  nome: yup.string().required('Nome é obrigatório'),
  sobrenome: yup.string().required('Sobrenome é obrigatório'),
  cpf: yup.string()
    .matches(/^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, 'CPF inválido')
    .required('CPF é obrigatório'),
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  password: yup.string().min(6, 'A senha deve ter no mínimo 6 caracteres').required('Senha é obrigatória'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password')], 'As senhas precisam ser iguais')
    .required('Confirmação de senha é obrigatória'),
  cep: yup.string()
    .matches(/^\d{5}-?\d{3}$/, 'CEP inválido')
    .required('CEP é obrigatório'),
  endereco: yup.string().required('Endereço é obrigatório'),
  numero: yup.string().required('Número é obrigatório'),
  complemento: yup.string().nullable(),
  cidade: yup.string().required('Cidade é obrigatória'),
  estado: yup.string().required('Estado é obrigatória'),
}).required();

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({ // Adicione 'reset'
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => { // Tornar a função assíncrona
    try {
      // Remover confirmPassword antes de enviar ao backend, pois o backend não precisa dele
      const { confirmPassword, ...dataToSend } = data;

      // Enviando os dados de registro para o backend
      const response = await axios.post(`${API_BASE_URL}/auth/signup`, dataToSend);

      console.log('Registro bem-sucedido:', response.data);
      alert(response.data.message || 'Usuário registrado com sucesso!'); // Exibir mensagem de sucesso
      reset(); // Opcional: Limpa o formulário após o registro
      navigate('/login'); // Redireciona para a página de login

    } catch (error: any) { // Capturar erros do axios
      console.error('Erro no registro:', error);
      // Extrair mensagem de erro do backend (NestJS)
      const errorMessage = error.response?.data?.message || 'Erro ao registrar usuário. Tente novamente.';
      alert(errorMessage);
    }
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
      }}
    >
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          paddingTop: '20px',
          paddingBottom: '20px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 4,
          boxShadow: 5,
          mt: { xs: 2, sm: 4, md: 6 },
          mb: { xs: 2, sm: 4, md: 6 },
        }}
      >
        <Box
          sx={{
            mt: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            component="img"
            src="/logo.png"
            alt="MyFinance Logo"
            sx={{
              width: 100,
              height: 100,
              mb: 2,
            }}
          />
          <Typography
            component="h1"
            variant="h5"
            sx={{
              mt: 1,
              mb: 3,
              fontWeight: 'bold',
              color: '#1976d2',
            }}
          >
            Cadastro MyFinance
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{ mt: 1 }}
          >
            {/* Campos do formulário */}
            <TextField margin="normal" required fullWidth id="nome" label="Nome" autoComplete="given-name" {...register('nome')} error={!!errors.nome} helperText={errors.nome?.message} />
            <TextField margin="normal" required fullWidth id="sobrenome" label="Sobrenome" autoComplete="family-name" {...register('sobrenome')} error={!!errors.sobrenome} helperText={errors.sobrenome?.message} />
            <TextField margin="normal" required fullWidth id="cpf" label="CPF" autoComplete="off" {...register('cpf')} error={!!errors.cpf} helperText={errors.cpf?.message} />
            <TextField margin="normal" required fullWidth id="email" label="Email" autoComplete="email" {...register('email')} error={!!errors.email} helperText={errors.email?.message} />
            <TextField margin="normal" required fullWidth label="Senha" type="password" id="password" autoComplete="new-password" {...register('password')} error={!!errors.password} helperText={errors.password?.message} />
            <TextField margin="normal" required fullWidth label="Confirme a Senha" type="password" id="confirmPassword" autoComplete="new-password" {...register('confirmPassword')} error={!!errors.confirmPassword} helperText={errors.confirmPassword?.message} />
            <TextField margin="normal" required fullWidth id="cep" label="CEP" autoComplete="postal-code" {...register('cep')} error={!!errors.cep} helperText={errors.cep?.message} />
            <TextField margin="normal" required fullWidth id="endereco" label="Endereço" autoComplete="street-address" {...register('endereco')} error={!!errors.endereco} helperText={errors.endereco?.message} />
            <TextField margin="normal" required fullWidth id="numero" label="Número" autoComplete="address-line2" {...register('numero')} error={!!errors.numero} helperText={errors.numero?.message} />
            <TextField margin="normal" fullWidth id="complemento" label="Complemento (Opcional)" autoComplete="address-line3" {...register('complemento')} error={!!errors.complemento} helperText={errors.complemento?.message} />
            <TextField margin="normal" required fullWidth id="cidade" label="Cidade" autoComplete="address-level2" {...register('cidade')} error={!!errors.cidade} helperText={errors.cidade?.message} />
            <TextField margin="normal" required fullWidth id="estado" label="Estado" autoComplete="address-level1" {...register('estado')} error={!!errors.estado} helperText={errors.estado?.message} />

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Cadastrar
            </Button>
            <Link href="/login" variant="body2">
              {"Já tem uma conta? Faça login"}
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default RegisterPage;