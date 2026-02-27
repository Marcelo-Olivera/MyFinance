# MyFinance

Aplicação fullstack de gerenciamento de finanças pessoais, desenvolvida com React, TypeScript e NestJS.

**[Acesse o projeto ao vivo](https://myfinance-frontend.vercel.app)**

---

## Sobre o Projeto

O MyFinance permite que usuários registrem receitas e despesas, organizem transações por categorias e acompanhem sua saúde financeira por meio de dashboards interativos com gráficos e filtros por período.

---

## Funcionalidades

- Autenticação segura com JWT e hashing de senhas via bcrypt
- Gestão de transações — registro, edição e exclusão de receitas e despesas
- Filtros por tipo, categoria e período de datas
- Categorias personalizadas com CRUD completo
- Dashboard analítico com gráficos interativos (Recharts) e resumo por categoria
- Interface responsiva com Material UI

---

## Tecnologias

**Frontend:** React, TypeScript, Vite, Material UI, React Hook Form, Yup, Axios, Recharts, React Router DOM

**Backend:** Node.js, NestJS, TypeScript, TypeORM, SQLite, JWT, Passport.js, bcryptjs, class-validator

---

## Estrutura do Projeto

```
MyFinance/
├── frontend/    # Aplicação React
└── backend/     # API NestJS
```

---

## Como Rodar Localmente

### Backend

```bash
cd backend
npm install
npm run start:dev
```

API disponível em `http://localhost:3000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Aplicação disponível em `http://localhost:5173`

---

## Autor

**Marcelo Oliveira** — [LinkedIn](https://www.linkedin.com/in/marcelosilvaoli) · [GitHub](https://github.com/Marcelo-Olivera)
