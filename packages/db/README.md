# db — Configuração do Banco de Dados

Pacote de configuração do banco de dados MySQL utilizando [Sequelize](https://sequelize.org/).

## Estrutura

```
src/
├── config/
│   └── database.ts    # Instância do Sequelize (conexão MySQL)
└── models/
    ├── index.ts       # Exporta models e associações
    ├── User.ts        # Model de usuário
    ├── Store.ts       # Model de loja
    └── Product.ts     # Model de produto
```

## Variáveis de Ambiente

Copie o `.env.Staging` como referência e crie seu `.env` local:

| Variável      | Descrição                           | Padrão      |
| ------------- | ----------------------------------- | ----------- |
| `DB_HOST`     | Host do MySQL                       | `localhost` |
| `DB_PORT`     | Porta do MySQL                      | `3306`      |
| `DB_NAME`     | Nome do banco                       | `icomida`   |
| `DB_USER`     | Usuário do MySQL                    | `root`      |
| `DB_PASSWORD` | Senha do MySQL                      | (vazio)     |
| `DB_DIALECT`  | Dialeto do Sequelize                | `mysql`     |
| `DB_LOGGING`  | Habilitar logs SQL (`true`/`false`) | `false`     |

## Pré-requisitos

- Node.js 18+
- MySQL 8+ rodando localmente (ou remoto configurado via variáveis de ambiente)

## Instalação

Na raiz do monorepo:

```bash
pnpm install
```

## Sincronizar o Banco de Dados

Para criar/atualizar as tabelas automaticamente a partir dos models:

```bash
pnpm --filter db run sync
```

Isso executa `sequelize.sync()` que cria as tabelas `users`, `stores` e `products` com as associações configuradas (cascade delete de products ao remover uma store).

> **Atenção:** `sync()` em produção pode causar perda de dados. Use migrations para ambientes de produção.

## Uso como Dependência

O pacote `client` consome este pacote via workspace:

```json
"dependencies": {
  "db": "workspace:*"
}
```

Para importar os models:

```ts
import db = require("db");

const { sequelize, Store, Product, User } = db;
```

## Models

### User

| Campo             | Tipo      | Descrição            |
| ----------------- | --------- | -------------------- |
| `id`              | UUID (PK) | Identificador único  |
| `avatar_url`      | STRING    | URL do avatar        |
| `billing_address` | JSON      | Endereço de cobrança |
| `payment_method`  | JSON      | Método de pagamento  |

### Store

| Campo        | Tipo              | Descrição                       |
| ------------ | ----------------- | ------------------------------- |
| `id`         | BIGINT (PK, auto) | Identificador único             |
| `name`       | STRING            | Nome da loja                    |
| `image_path` | STRING            | Caminho da imagem               |
| `category`   | STRING            | Categoria (PIZZA, BURGER, etc.) |
| `active`     | BOOLEAN           | Loja ativa (default: true)      |
| `user_id`    | UUID (FK → User)  | Dono da loja                    |

### Product

| Campo         | Tipo                | Descrição                          |
| ------------- | ------------------- | ---------------------------------- |
| `id`          | UUID (PK)           | Identificador único                |
| `name`        | STRING              | Nome do produto                    |
| `description` | TEXT                | Descrição                          |
| `image`       | STRING              | Caminho da imagem                  |
| `store_id`    | BIGINT (FK → Store) | Loja associada                     |
| `active`      | BOOLEAN             | Produto ativo (default: true)      |
| `metadata`    | JSON                | Metadados (ex: `{ price: 25.00 }`) |
