# MyFinance — Backend

API REST do MyFinance, desenvolvida com NestJS e TypeScript.

---

## Tecnologias

- Node.js + NestJS
- TypeScript
- TypeORM + SQLite
- JWT + Passport.js
- bcryptjs
- class-validator + class-transformer

---

## Como Rodar

```bash
npm install
npm run start:dev
```

API disponível em `http://localhost:3000`

---

## Endpoints

### Autenticação

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /auth/signup | Registra novo usuário |
| POST | /auth/signin | Autentica usuário e retorna JWT |

Os demais endpoints exigem Bearer Token no header `Authorization`.

### Categorias

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /categories | Lista categorias do usuário |
| POST | /categories | Cria nova categoria |
| GET | /categories/:id | Busca categoria por ID |
| PATCH | /categories/:id | Atualiza categoria |
| DELETE | /categories/:id | Remove categoria |

### Transações

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /transactions | Lista transações com filtros opcionais |
| POST | /transactions | Cria nova transação |
| GET | /transactions/:id | Busca transação por ID |
| PATCH | /transactions/:id | Atualiza transação |
| DELETE | /transactions/:id | Remove transação |
| GET | /transactions/summary | Resumo geral (receitas, despesas, saldo) |
| GET | /transactions/summary-by-category | Resumo agrupado por categoria |

**Filtros disponíveis em GET /transactions:** `?type=income`, `?categoryId=1`, `?startDate=2025-07-01&endDate=2025-07-31`

**Filtros disponíveis em GET /transactions/summary-by-category:** `?startDate=2025-07-01&endDate=2025-07-31`
