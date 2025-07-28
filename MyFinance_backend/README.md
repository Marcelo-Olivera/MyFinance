# MyFinance - Backend

## Visão Geral

Este diretório contém o código-fonte da API que desenvolvi para o projeto MyFinance. Construída com NestJS, esta camada de backend é a espinha dorsal da aplicação, responsável por gerenciar a lógica de negócio, a persistência de dados (usuários, transações e categorias) e a autenticação. Meu foco foi em fornecer endpoints seguros e eficientes para o frontend, garantindo a integridade e a disponibilidade das informações financeiras.

## Funcionalidades Implementadas

As seguintes funcionalidades foram implementadas e estão plenamente operacionais no backend:

* **Módulo de Autenticação (`AuthModule`):**
    * **Registro (`POST /auth/signup`):** Implementei a criação de novos usuários com validação robusta de dados, hashing seguro de senhas utilizando `bcryptjs` e tratamento adequado para e-mails duplicados, retornando um `409 Conflict` quando aplicável.
    * **Login (`POST /auth/signin`):** Desenvolvi a autenticação de usuários existentes, verificando as credenciais fornecidas e gerando JSON Web Tokens (JWT) para estabelecer sessões seguras.
    * **Proteção de Rotas:** Utilizo o `JwtAuthGuard` para proteger endpoints sensíveis em toda a aplicação, assegurando que apenas usuários autenticados e devidamente autorizados possam acessá-los.

* **Módulo de Categorias (`CategoriesModule`):**
    * **CRUD Completo:** Criei endpoints para todas as operações CRUD (Create, Read, Update, Delete) em categorias financeiras. Isso inclui `POST /categories` para criação, `GET /categories` para listagem, `GET /categories/:id` para visualização detalhada, `PATCH /categories/:id` para atualização e `DELETE /categories/:id` para exclusão.
    * As categorias são associadas ao usuário que as criou, garantindo a segregação e privacidade dos dados.

* **Módulo de Transações (`TransactionsModule`):**
    * **CRUD Completo:** Desenvolvi endpoints para gerenciar transações financeiras (receitas e despesas), incluindo `POST /transactions` para criação, `GET /transactions` para listagem, `GET /transactions/:id` para visualização individual, `PATCH /transactions/:id` para atualização e `DELETE /transactions/:id` para exclusão.
    * **Filtros Avançados:** O endpoint de listagem de transações (`GET /transactions`) suporta filtros opcionais por tipo de transação, categoria, data inicial e data final.
    * **Resumo Financeiro:**
        * **Resumo Geral (`GET /transactions/summary`):** Implementei um endpoint que retorna o total de receitas, total de despesas e o saldo geral do usuário.
        * **Resumo por Categoria (`GET /transactions/summary-by-category`):** Desenvolvi um endpoint que fornece os totais de receitas e despesas agrupados por categoria, com suporte a filtros de data. Transações sem categoria definida são inteligentemente agrupadas sob a categoria "Outros".

* **Configuração de Banco de Dados:**
    * Configurei a conexão com **SQLite** para o ambiente de desenvolvimento, facilitando a prototipagem e testes. O TypeORM é utilizado para o mapeamento objeto-relacional, com `synchronize: true` ativado para criação automática de tabelas durante o desenvolvimento.
    * Modelei as entidades (`User`, `Category`, `Transaction`) e seus respectivos relacionamentos para garantir uma estrutura de dados consistente.

* **Validação de Dados:** Utilizo `class-validator` e `class-transformer` para realizar validações automáticas de Data Transfer Objects (DTOs) nas requisições, assegurando a integridade dos dados recebidos.

## Tecnologias e Dependências Principais

* **NestJS:** Framework Node.js progressivo que utilizei para construir uma arquitetura de backend eficiente, modular e escalável.
* **TypeORM:** ORM (Object-Relational Mapper) que me permitiu interagir com o banco de dados SQLite de forma orientada a objetos.
* **bcryptjs:** Biblioteca criptográfica empregada para o hashing seguro de senhas dos usuários.
* **jsonwebtoken:** Ferramenta essencial para a implementação e verificação de JSON Web Tokens (JWTs) para autenticação.
* **@nestjs/jwt, @nestjs/passport, passport, passport-jwt:** Módulos e estratégias do NestJS que utilizei para integrar e gerenciar a autenticação baseada em JWT.
* **class-validator, class-transformer:** Bibliotecas para validação e transformação de objetos de dados, garantindo a conformidade dos DTOs.
* **@nestjs/common, @nestjs/core, @nestjs/platform-express:** Módulos fundamentais do NestJS que formam a base da aplicação.
* **dotenv:** Utilizado para o gerenciamento de variáveis de ambiente, crucial para configurações sensíveis como segredos JWT.

## Como Rodar o Backend

Para iniciar o servidor do backend, siga os passos abaixo:

1.  Certifique-se de ter o Node.js e o npm (ou Yarn) instalados em sua máquina.
2.  No terminal, navegue até este diretório (`MyFinance_backend`).
3.  Instale as dependências do projeto:
    ```bash
    npm install
    # ou yarn install
    ```
4.  Inicie o servidor em modo de desenvolvimento, que inclui hot-reload para agilizar o desenvolvimento:
    ```bash
    npm run start:dev
    # ou yarn start:dev
    ```
5.  O backend estará acessível em `http://localhost:3000` (verifique o console para a porta exata, caso seja diferente).

## Endpoints da API

Todos os endpoints listados abaixo estão protegidos por autenticação JWT e exigem a inclusão de um `Bearer Token` no cabeçalho `Authorization` da requisição.

### Autenticação (`/auth`)
* **`POST /auth/signup`**
    * **Descrição:** Registra um novo usuário no sistema.
    * **Corpo da Requisição (JSON):**
        ```json
        {
            "email": "novo.usuario@example.com",
            "password": "umaSenhaSegura123",
            "nome": "João",
            "sobrenome": "Silva",
            "cpf": "123.456.789-00",
            "cep": "12345-678",
            "endereco": "Rua das Flores",
            "numero": "123",
            "complemento": "Apto 101",
            "cidade": "São Paulo",
            "estado": "SP"
        }
        ```
    * **Resposta de Sucesso (201 Created):** `{"message": "Usuário registrado com sucesso!"}`
* **`POST /auth/signin`**
    * **Descrição:** Autentica um usuário existente e retorna um JWT.
    * **Corpo da Requisição (JSON):**
        ```json
        {
            "email": "usuario.existente@example.com",
            "password": "suaSenhaSegura123"
        }
        ```
    * **Resposta de Sucesso (200 OK):** `{"accessToken": "eyJhbGciOiJIUzI1Ni..."}`

### Categorias (`/categories`)
* **`POST /categories`**
    * **Descrição:** Cria uma nova categoria para o usuário autenticado.
    * **Corpo da Requisição (JSON):** `{"name": "Alimentação", "color": "#FF5733"}`
* **`GET /categories`**
    * **Descrição:** Lista todas as categorias pertencentes ao usuário autenticado.
* **`GET /categories/:id`**
    * **Descrição:** Busca uma categoria específica pelo ID, verificando se pertence ao usuário.
* **`PATCH /categories/:id`**
    * **Descrição:** Atualiza uma categoria existente pelo ID, verificando a posse.
    * **Corpo da Requisição (JSON):** `{"name": "Alimentação Atualizada", "color": "#33FF57"}`
* **`DELETE /categories/:id`**
    * **Descrição:** Exclui uma categoria pelo ID, verificando a posse.

### Transações (`/transactions`)
* **`POST /transactions`**
    * **Descrição:** Cria uma nova transação (receita ou despesa) para o usuário autenticado.
    * **Corpo da Requisição (JSON):**
        ```json
        {
            "amount": 150.75,
            "description": "Jantar com amigos",
            "date": "2025-07-25",
            "type": "expense",
            "categoryId": 1,
            "notes": "Pizza e bebidas"
        }
        ```
* **`GET /transactions`**
    * **Descrição:** Lista todas as transações do usuário autenticado, com suporte a filtros opcionais.
    * **Query Params:** `?type=income` ou `?categoryId=1` ou `?startDate=2025-07-01&endDate=2025-07-31`
* **`GET /transactions/:id`**
    * **Descrição:** Busca uma transação específica pelo ID, verificando a posse.
* **`PATCH /transactions/:id`**
    * **Descrição:** Atualiza uma transação existente pelo ID, verificando a posse.
    * **Corpo da Requisição (JSON):** `{"amount": 160.00, "description": "Jantar atualizado"}`
* **`DELETE /transactions/:id`**
    * **Descrição:** Exclui uma transação pelo ID, verificando a posse.
* **`GET /transactions/summary`**
    * **Descrição:** Retorna o resumo financeiro geral (total de receitas, despesas e saldo) para o usuário autenticado.
* **`GET /transactions/summary-by-category`**
    * **Descrição:** Retorna os totais de receitas e despesas agrupados por categoria, com suporte a filtros de data opcionais. Transações sem categoria são agrupadas como "Outros".
    * **Query Params:** `?startDate=2025-07-01&endDate=2025-07-31`