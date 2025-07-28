# MyFinance

## Visão Geral do Projeto

Eu desenvolvi o MyFinance como uma aplicação fullstack completa e intuitiva, com o objetivo principal de capacitar os usuários a gerenciar suas finanças pessoais de forma eficiente e segura. Minha meta foi criar uma plataforma robusta onde os usuários pudessem registrar receitas e despesas, visualizar extratos detalhados, categorizar transações e, crucialmente, obter uma visão clara de sua saúde financeira através de dashboards interativos.

Este projeto representa um portfólio abrangente das minhas habilidades em desenvolvimento web, tanto no front-end quanto no back-end. Eu me dediquei a utilizar tecnologias modernas e aplicar as melhores práticas do mercado para construir uma aplicação escalável, segura e de alta qualidade.

## Funcionalidades Chave

No MyFinance, implementei uma série de funcionalidades essenciais para um gerenciamento financeiro completo:

* **Autenticação de Usuários:** Criei um sistema de registro e login seguro, utilizando JSON Web Tokens (JWT) para gerenciar as sessões dos usuários.

* **Gestão de Categorias:** Desenvolvi um módulo completo para o CRUD (Criação, Visualização, Edição e Exclusão) de categorias financeiras. Isso permite que os usuários personalizem a organização de suas transações.

* **Gestão de Transações:**
    * Implementei o registro detalhado de receitas e despesas, capturando todas as informações relevantes.
    * Criei uma Página de Extrato robusta, com listagem de transações, filtros avançados por tipo, categoria e data, além de funcionalidades diretas de edição e exclusão.
    * Desenvolvi um modal de formulário dedicado para a adição e edição de transações, garantindo a consistência e validação dos dados inseridos.

* **Dashboard Financeiro Interativo:**
    * Projetei uma Página Inicial (Home) que serve como o ponto de entrada principal após o login, exibindo um resumo financeiro rápido com saldo, receita total e despesa total.
    * Construí um Dashboard detalhado que apresenta visualizações gráficas (utilizando Recharts) de receitas e despesas, categorizadas para uma análise aprofundada.
    * Adicionei filtros de data aos gráficos, permitindo que os usuários analisem seus dados financeiros em períodos específicos.
    * Para complementar os gráficos, incluí tabelas de resumo separadas para receitas e despesas por categoria, oferecendo uma representação numérica clara.
    * Garanti que transações sem categoria definida fossem inteligentemente agrupadas sob a categoria "Outros" nos relatórios.

* **Navegação e Usabilidade:** Minha prioridade foi criar uma interface intuitiva e responsiva, com um fluxo de navegação claro entre todas as seções do aplicativo, assegurando uma experiência de usuário fluida em qualquer dispositivo.

* **Segurança:** Incorporei medidas de segurança essenciais, como a implementação de JWT para autenticação, hashing de senhas para proteção de credenciais e validação rigorosa de dados em todas as entradas.

## Tecnologias Utilizadas

Para o desenvolvimento deste projeto, utilizei um stack tecnológico moderno e eficiente:

### Frontend

* **React:** Escolhi esta biblioteca JavaScript para construir a interface de usuário, aproveitando sua componentização e reatividade.
* **TypeScript:** Adotei o TypeScript para adicionar tipagem estática ao JavaScript, o que me ajudou a criar um código mais robusto e com menos erros.
* **Material-UI:** Utilizei esta biblioteca de componentes React para implementar o Material Design, garantindo um visual profissional e consistente.
* **React Hook Form & Yup:** Empreguei estas ferramentas para gerenciar e validar formulários de forma eficiente e com alta performance.
* **React Router DOM:** Para gerenciar a navegação e as rotas da aplicação de forma declarativa.
* **Axios:** Utilizei este cliente HTTP para realizar as requisições à API do backend de forma assíncrona.
* **Recharts:** Selecionei esta biblioteca para criar os gráficos interativos e visualizações de dados no Dashboard.

### Backend

* **NestJS:** Optei por este framework Node.js para construir o backend, devido à sua arquitetura progressiva e sua capacidade de criar aplicações eficientes e escaláveis.
* **Node.js:** O ambiente de tempo de execução JavaScript no qual o backend foi construído.
* **TypeScript:** Mantive o TypeScript em todo o desenvolvimento backend para os mesmos benefícios de robustez e clareza.
* **TypeORM:** Utilizei este ORM para interagir com o banco de dados, facilitando o mapeamento objeto-relacional.
* **SQLite:** Escolhi o SQLite como banco de dados relacional leve para o ambiente de desenvolvimento e testes.
* **bcryptjs:** Empreguei esta biblioteca para garantir o hashing seguro das senhas dos usuários.
* **jsonwebtoken:** Essencial para a implementação e validação dos JSON Web Tokens (JWT) para autenticação.
* **Passport.js:** Utilizei este middleware de autenticação para Node.js, integrado ao NestJS, para estratégias de autenticação.
* **class-validator & class-transformer:** Ferramentas que me auxiliaram na validação e transformação de DTOs (Data Transfer Objects), garantindo a integridade dos dados nas requisições.

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