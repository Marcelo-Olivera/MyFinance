# MyFinance — Frontend

Interface de usuário do MyFinance, desenvolvida com React e TypeScript.

---

## Tecnologias

- React + TypeScript
- Vite
- Material UI
- React Hook Form + Yup
- Axios
- Recharts
- React Router DOM

---

## Páginas

**Login e Registro** — autenticação com validação de formulário e armazenamento de JWT no localStorage.

**Home** — resumo financeiro com saldo atual, total de receitas e total de despesas, além de navegação para as demais seções.

**Transações** — listagem completa com filtros por tipo, categoria e período. Criação e edição via modal.

**Categorias** — CRUD completo de categorias financeiras via modal.

**Dashboard** — gráficos de pizza por categoria (Recharts), filtros de data e tabelas de resumo de receitas e despesas.

---

## Como Rodar

Certifique-se de que o backend esteja em execução antes de iniciar o frontend.

```bash
npm install
npm run dev
```

Aplicação disponível em `http://localhost:5173`
