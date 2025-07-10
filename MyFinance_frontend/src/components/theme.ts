// src/theme/index.ts
import { createTheme } from '@mui/material/styles';

const myFinanceTheme = createTheme({
  palette: {
    mode: 'light', // Ou 'dark'
    primary: {
      main: '#0D47A1', // Azul escuro
    },
    secondary: {
      main: '#2E7D32', // Verde escuro
      dark: '#1B5E20',
    },
    // AJUSTE DA COR DE TEXTO PRIMÁRIA (DE BRANCO PARA AZUL/VERDE CLARO)
    text: {
      primary: '#E0F2F1',   // Um tom muito claro de ciano/azul esverdeado (ex: Light Cyan ou Teal claro)
      secondary: '#C8AE7D', // Dourado mais suave
      disabled: 'rgba(255, 255, 255, 0.5)',
    },
    info: {
      main: '#BBDEFB',
    },
    background: {
      default: '#121212', // Fundo padrão para o body, se não houver imagem
      paper: '#FFFFFF', // Cor de fundo para componentes como cards, modais (o branco do formulário)
    },
  },
  typography: {
    h1: {
      color: '#C8AE7D', // Dourado
    },
    h5: {
      color: '#E0F2F1', // Usará a nova cor primária de texto para títulos h5 (como em Login/Registro)
    },
    body1: {
      color: '#E0F2F1', // Usará a nova cor primária de texto para textos de corpo
    },
    // ...
  },
});

export default myFinanceTheme;