# MyFinance - Frontend

## Visão Geral

Neste diretório, concentrei o desenvolvimento do código-fonte da interface de usuário (frontend) para o projeto MyFinance. Minha abordagem foi construir a aplicação utilizando React, TypeScript e a biblioteca Material-UI, visando entregar uma experiência de usuário moderna, responsiva e altamente intuitiva para o gerenciamento de finanças pessoais.

## Funcionalidades Implementadas

As seguintes funcionalidades foram cuidadosamente implementadas e estão plenamente operacionais no frontend:

* **Página de Login (`/login`):**
    * Desenvolvi o formulário de login, incorporando validação robusta de e-mail e senha através do React Hook Form e Yup.
    * Priorizei um design responsivo, utilizando os componentes do Material-UI.
    * Após um login bem-sucedido, o usuário é redirecionado de forma fluida para a página inicial (`/home`).
    * A integração com o endpoint `/auth/signin` do backend foi realizada para gerenciar o processo de autenticação.
    * Implementei o armazenamento do JWT (JSON Web Token) no `localStorage` para persistência da sessão.

* **Página de Registro (`/register`):**
    * Criei um formulário de cadastro abrangente, com múltiplos campos de usuário e validação extensiva para garantir a integridade dos dados.
    * O layout é responsivo, construído com componentes do Material-UI.
    * Após um registro bem-sucedido, o usuário é direcionado para a página de login.
    * A integração com o endpoint `/auth/signup` do backend foi estabelecida para a criação de novos usuários.

* **Página Inicial (Home - `/home`):**
    * Esta página serve como o principal ponto de entrada após o login do usuário.
    * Ela exibe um resumo financeiro conciso, incluindo o saldo atual, o total de receitas e o total de despesas, todos os dados obtidos dinamicamente do backend.
    * Incorporei cards de navegação intuitivos para facilitar o acesso às principais seções da aplicação (Extrato, Categorias, Dashboard).
    * Adicionei um botão "Sair" para permitir o encerramento seguro da sessão do usuário.

* **Página de Gerenciamento de Categorias (`/categories`):**
    * Desenvolvi a listagem de todas as categorias financeiras pertencentes ao usuário.
    * Implementei todas as operações CRUD (Criar, Visualizar, Editar, Excluir) para as categorias, proporcionando controle total ao usuário.
    * Utilizo um modal de formulário (`CategoryFormModal`) para uma experiência de adição e edição de categorias mais fluida e organizada.

* **Página de Transações (Extrato - `/transactions`):**
    * Esta página apresenta uma lista detalhada de todas as transações (receitas e despesas) do usuário.
    * Implementei filtros avançados por tipo de transação (receita/despesa), categoria e período de datas, permitindo uma análise granular.
    * As funcionalidades de edição e exclusão de transações estão disponíveis diretamente na lista.
    * Similar às categorias, utilizo um modal de formulário (`TransactionFormModal`) para a adição e edição de transações.

* **Página de Dashboard Financeiro (`/dashboard`):**
    * Esta seção é dedicada a visualizações gráficas interativas (utilizando a biblioteca Recharts) das finanças do usuário.
    * Apresento gráficos de pizza para "Receitas por Categoria" e "Despesas por Categoria", facilitando a compreensão da distribuição dos valores.
    * As transações sem categoria definida são agrupadas de forma inteligente sob a categoria "Outros" nos gráficos.
    * Incorporei filtros de data, permitindo que os usuários analisem seus dados financeiros em períodos específicos.
    * Para complementar os gráficos, adicionei tabelas de resumo separadas para "Total de Receitas por Categoria" e "Total de Despesas por Categoria", fornecendo dados numéricos precisos.

* **Componentes Reutilizáveis:** Minha estratégia de desenvolvimento incluiu a criação de componentes React modulares e bem definidos, que são reutilizados em diversas partes da aplicação, como formulários, modais, tabelas e gráficos.

* **Estilização e Responsividade:** Apliquei um tema Material-UI consistente em todo o frontend e garanti a responsividade da interface, proporcionando uma experiência de usuário otimizada em uma variedade de dispositivos (desktops, tablets e smartphones).

## Como Rodar o Frontend (Guia de Instalação e Execução)

Para configurar e executar o frontend em seu ambiente de desenvolvimento local, siga os passos abaixo:

1.  Certifique-se de que o [Backend](./../MyFinance_backend/README.md) do projeto já esteja em execução.
2.  Abra o terminal e navegue até este diretório (`MyFinance_frontend`).
3.  Instale todas as dependências do projeto, caso ainda não o tenha feito:
    ```bash
    npm install
    # ou yarn install
    ```
4.  Inicie o servidor de desenvolvimento do React:
    ```bash
    npm run dev
    # ou yarn dev
    ```
5.  Após a inicialização, abra seu navegador e acesse `http://localhost:5173` (a porta pode variar; verifique a saída no terminal).