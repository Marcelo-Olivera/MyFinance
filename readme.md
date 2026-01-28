# MyFinance

## Visão Geral

MyFinance é uma aplicação fullstack para gerenciamento de finanças pessoais, desenvolvida com foco em usabilidade, segurança e boas práticas de engenharia de software.

A plataforma permite que usuários registrem receitas e despesas, organizem transações por categorias, visualizem extratos detalhados e acompanhem sua saúde financeira por meio de dashboards interativos.

O projeto foi desenvolvido como portfólio técnico, demonstrando domínio tanto de frontend moderno quanto de backend estruturado e escalável.

## Funcionalidades 

  - Autenticação e Segurança

  - Cadastro e login de usuários

  - Autenticação baseada em JWT

  - Hashing de senhas com bcrypt

  - Validação de dados em todas as requisições

## Categorias

  - CRUD completo de categorias financeiras

  - Associação direta com o usuário autenticado

  - Tratamento seguro de relacionamentos

## Transações

  - Registro de receitas e despesas

  - Extrato financeiro com:

  - Filtros por tipo, categoria e data

  - Edição e exclusão de transações

  - Modal dedicado para criação e edição, com validação de dados

## Dashboard Financeiro

  - Página inicial com resumo financeiro:

  - Saldo atual

  - Total de receitas

  - Total de despesas

## Dashboard analítico com:

  - Gráficos interativos de receitas e despesas (Recharts)

  - Filtros por período

  - Tabelas de resumo por categoria

  - Agrupamento automático de transações sem categoria em “Outros”

## Experiência do Usuário

  - Interface responsiva e intuitiva

  - Navegação clara entre módulos

  - Feedback visual consistente com Material Design

## Tecnologias Utilizadas
  
## Frontend:

  - React

  - TypeScript

  - Vite

  - Material UI

  - React Hook Form + Yup

  - React Router DOM

  - Axios

  - Recharts

## Backend

  - Node.js

  - NestJS

  - TypeScript

  - TypeORM

  - SQLite (ambiente local)

  - JWT

  - bcryptjs

  - Passport.js

  - class-validator / class-transformer

## Estrutura do Projeto

A organização do projeto segue uma estrutura modular, separando claramente o frontend e o backend:

MyFinance/
├── MyFinance_frontend/  
│   ├── public/  
│   ├── src/  
│   └── README.md   <-- README do Frontend  
├── MyFinance_backend/  
│   ├── src/  
│   ├── node_modules/  
│   └── README.md   <-- README do Backend  
├── node_modules/  
├── package.json  
└── README.md       <-- README Principal  


## Como Rodar o Projeto

Para colocar o MyFinance em funcionamento em seu ambiente local, siga os passos abaixo para iniciar tanto o backend quanto o frontend.

### 1. Iniciar o Backend

Navegue até a pasta `MyFinance_backend` e siga as instruções detalhadas no [README do Backend](./MyFinance_backend/README.md).

### 2. Iniciar o Frontend

Navegue até a pasta `MyFinance_frontend` e siga as instruções detalhadas no [README do Frontend](./MyFinance_frontend/README.md).