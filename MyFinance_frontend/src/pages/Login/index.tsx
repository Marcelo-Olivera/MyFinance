// src/pages/Login/index.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button, TextField, Typography, Box, Container, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

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

  const onSubmit = (data: any) => {
    console.log('Dados de Login:', data);
    // TODO: Enviar dados para o backend NestJS
    alert('Login simulado! Dados: ' + JSON.stringify(data));
    navigate('/dashboard'); // Redirecionar para o dashboard após login (simulado)
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center', // Centraliza verticalmente
        alignItems: 'center',     // Centraliza horizontalmente
        minHeight: '100vh',       // Garante que o Box ocupe 100% da altura da viewport
        width: '100vw',           // Garante que o Box ocupe 100% da largura da viewport
        backgroundImage: 'url("/background.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}>
      <Container component="main" maxWidth="xs"
      sx={{
          //paddingTop: '20px', // Adiciona um padding na parte superior
          paddingBottom: '20px', // Adiciona um padding na parte inferior
          backgroundColor: 'rgba(255, 255, 255)', // Fundo branco semi-transparente
          borderRadius: 4, // Bordas arredondadas para o container
          boxShadow: 5, // Uma sombra mais forte
          mt: { xs: 2, sm: 4, md: 6 }, // margin-top diferente para cada breakpoint
          mb: { xs: 2, sm: 4, md: 6 }, // margin-bottom diferente para cada breakpoint
        }}>
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box
            component="img"
            src="/logo.png" // Caminho relativo à pasta public. Altere se o nome do arquivo for diferente.
            // Se você importou a imagem diretamente (Opção 2), use: src={logoImage}
            alt="MyFinance Logo"
            sx={{
              width: 120, // Ajuste o tamanho da logo conforme sua preferência
              height: 120, // A altura será ajustada para manter a proporção se a largura for definida

            }}
          />
          <Typography component="h1" variant="h5"
            sx={{ 
              mt: 2,
              mb: 2,
              fontWeight: 'bold',
              color: '#1976d2'}}>
            Login
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
            />
            <TextField
              margin="normal"
              required
              fullWidth
              //name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
              {...register('password')}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Entrar
            </Button>
            <Link href="/register" variant="body2">
              {"Não tem uma conta? Cadastre-se"}
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;