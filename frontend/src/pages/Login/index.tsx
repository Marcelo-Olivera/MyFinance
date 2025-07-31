// src/pages/Login/index.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button, TextField, Typography, Box, Container, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Importe o axios


const API_BASE_URL = import.meta.env.VITE_API_URL;

// Esquema de validação com Yup
const schema = yup.object({
  email: yup.string().email('Email inválido').required('Email é obrigatório'),
  password: yup.string().min(6, 'A senha deve ter no mínimo 6 caracteres').required('Senha é obrigatória'),
}).required();

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => { // Tornar a função assíncrona
    try {
      // Enviando os dados de login para o backend
      const response = await axios.post(`${API_BASE_URL}/auth/signin`, {
        email: data.email,
        password: data.password,
      });

      const { accessToken } = response.data; // Extrai o accessToken da resposta
      console.log('Login bem-sucedido! Token:', accessToken);

      // --- Armazenar o JWT no LocalStorage ---
      // IMPORTANTE: Para uma aplicação real, considere opções mais seguras
      // dependendo do contexto (ex: HttpOnly cookies se for usar SSR)
      localStorage.setItem('accessToken', accessToken);

      alert('Login realizado com sucesso!');
      navigate('/home'); // Redireciona para Página Inicial após o login

    } catch (error: any) { // Capturar erros do axios
      console.error('Erro no login:', error);
      // Extrair mensagem de erro do backend (NestJS)
      const errorMessage = error.response?.data?.message || 'Erro ao fazer login. Credenciais inválidas.';
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
        backgroundImage: 'url("/background.png")', // Caminho para o background na pasta public
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            p: 4,
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            component="img"
            src="/logo.png" // Caminho para a logo na pasta public. Ajuste se o nome do arquivo for diferente.
            alt="MyFinance Logo"
            sx={{
              width: 120, // Ajuste o tamanho da logo conforme sua preferência
              height: 120,
              mb: 3,
            }}
          />
          <Typography
            component="h1"
            variant="h5"
            sx={{
              color: 'text.primary', 
              mb: 2,
            }}
          >
            Login MyFinance
          </Typography>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              autoComplete="email"
              autoFocus
              {...register('email')}
              error={!!errors.email}
              helperText={errors.email?.message}
              InputLabelProps={{
                sx: { color: 'text.primary' }
              }}
              InputProps={{
                sx: { color: 'text.primary' }
              }}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'text.secondary', // Cor dourada para a borda
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'text.secondary',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'text.secondary',
                },
                '& .MuiFormHelperText-root': {
                    color: 'text.primary',
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputLabelProps={{
                sx: { color: 'text.primary' }
              }}
              InputProps={{
                sx: { color: 'text.primary' }
              }}
              sx={{
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'text.secondary',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'text.secondary',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'text.secondary',
                },
                '& .MuiFormHelperText-root': {
                    color: 'text.primary',
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: 'secondary.main', // Cor do tema (ex: verde)
                '&:hover': {
                  backgroundColor: 'secondary.dark',
                },
                color: 'text.primary', // Cor do texto do botão
              }}
            >
              Entrar
            </Button>
            <Link
              href="/register"
              variant="body2"
              sx={{
                color: 'text.secondary', // Cor do tema (ex: dourado)
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              }}
            >
              {"Não tem uma conta? Cadastre-se"}
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;