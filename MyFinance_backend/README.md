# MyFinance - Backend

## Visão Geral

Este diretório contém o código-fonte da API (backend) da aplicação MyFinance. Construído com NestJS, o backend é responsável por gerenciar a lógica de negócio, a persistência de dados (usuários, transações) e a autenticação, fornecendo endpoints seguros para o frontend.

## Funcionalidades Implementadas

Até o momento, as seguintes funcionalidades foram desenvolvidas no backend:

* **Autenticação de Usuários:**
    * **Registro (`POST /auth/signup`):**
        * Recebe email e senha (e outros dados de usuário).
        * Realiza validação automática de DTO (com `class-validator`).
        * Faz o hash seguro da senha com `bcryptjs`.
        * Armazena o novo usuário no banco de dados SQLite.
        * Lida com e-mails duplicados (retorna `409 Conflict`).
    * **Login (`POST /auth/signin`):**
        * Recebe email e senha.
        * Realiza validação automática de DTO.
        * Verifica as credenciais do usuário.
        * Se as credenciais forem válidas, gera um JSON Web Token (JWT) usando `@nestjs/jwt` e `jsonwebtoken`.
        * Retorna o `accessToken` para o cliente.
    * **Hashing de Senhas:** Todas as senhas são armazenadas como hashes.
    * **Geração e Validação de JWT:** Tokens são gerados para sessões autenticadas.

* **Configuração de Banco de Dados:**
    * Conexão com **SQLite** para desenvolvimento (arquivo `db.sqlite` criado automaticamente).
    * Gerenciamento de entidades (`User`) via **TypeORM**.
    * `synchronize: true` ativado em desenvolvimento para criação automática de tabelas (desativar em produção e usar migrações).

## Tecnologias e Dependências Principais

* **NestJS:** Core framework.
* **TypeORM:** ORM para SQLite.
* **bcryptjs:** Para segurança de senhas.
* **jsonwebtoken:** Para JWT.
* **@nestjs/jwt, @nestjs/passport, passport, passport-jwt:** Módulos e bibliotecas para autenticação JWT.
* **class-validator, class-transformer:** Para validação de dados com DTOs.
* **@nestjs/common, @nestjs/core, @nestjs/platform-express:** Módulos base do NestJS.
* **dotenv:** Para variáveis de ambiente (futuramente, para o JWT Secret).

## Como Rodar o Backend

1.  Certifique-se de ter o Node.js e o npm (ou Yarn) instalados.
2.  No terminal, navegue até este diretório (`MyFinance_backend`).
3.  Instale as dependências:
    ```bash
    npm install
    # ou yarn install
    ```
4.  Inicie o servidor em modo de desenvolvimento (com hot-reload):
    ```bash
    npm run start:dev
    # ou yarn start:dev
    ```
5.  O backend estará rodando em `http://localhost:3000` (verifique o console para a porta exata).

## Próximos Passos (Backend)

* Implementar a proteção de rotas usando JWT Guards.
* Criar e gerenciar outras entidades (Ex: `Transaction`, `Category`).
* Desenvolver endpoints para gerenciamento de finanças (criação/leitura/atualização/deleção de transações).
* Configurar variáveis de ambiente para o JWT Secret e dados do banco de dados em produção.
* Configurar o sistema de migrações do TypeORM para produção.
