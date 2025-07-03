# MyFinance - Frontend

## Visão Geral

Este diretório contém o código-fonte da interface de usuário (frontend) da aplicação MyFinance. Desenvolvido com React e Material-UI, o frontend oferece uma experiência de usuário moderna e responsiva para gerenciamento financeiro pessoal.

## Funcionalidades Implementadas

Até o momento, as seguintes funcionalidades foram desenvolvidas no frontend:

* **Página de Login (`/login`):**
    * Formulário de login com validação de email e senha (usando React Hook Form e Yup).
    * Design responsivo com Material-UI.
    * Campo para redirecionamento para a página de cadastro.
    * **Integração com Backend:** Envia credenciais para o endpoint `/auth/signin` do backend.
    * Tratamento de sucesso e erro na requisição.
    * (Próximo passo: Armazenamento do JWT no LocalStorage).

* **Página de Registro (`/register`):**
    * Formulário de cadastro completo com campos: Nome, Sobrenome, CPF, Email, Senha, Confirmação de Senha, CEP, Endereço, Número, Complemento (opcional), Cidade, Estado.
    * Validação abrangente de todos os campos (usando React Hook Form e Yup).
    * Layout responsivo em coluna única com Material-UI.
    * Campo para redirecionamento para a página de login.
    * **Integração com Backend:** Envia dados do usuário para o endpoint `/auth/signup` do backend.
    * Tratamento de sucesso e erro na requisição.

## Como Rodar o Frontend

1.  Certifique-se de que o [Backend](./../MyFinance_backend/README.md) esteja rodando.
2.  No terminal, navegue até este diretório (`MyFinance_frontend`).
3.  Instale as dependências:
    ```bash
    npm install
    # ou yarn install
    ```
4.  Inicie o servidor de desenvolvimento:
    ```bash
    npm run dev
    # ou yarn dev
    ```
5.  Abra seu navegador em `http://localhost:5173`.

## Próximos Passos (Frontend)

* Implementar o armazenamento do JWT no LocalStorage após o login.
* Criar um contexto de autenticação para gerenciar o estado do usuário logado.
* Desenvolver o Dashboard principal com a visão geral das finanças.
* Implementar a adição, edição e exclusão de transações.