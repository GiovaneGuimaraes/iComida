# client — REST API

Servidor Express que expõe a REST API do iComida, consumindo o pacote `db` para acesso ao banco de dados MySQL.

## Estrutura

```
src/
├── index.js                  # App Express + inicialização do servidor
├── controllers/
│   ├── storeController.js    # CRUD de lojas
│   └── productController.js  # CRUD de produtos
└── routes/
    ├── stores.js             # Rotas /api/stores
    └── products.js           # Rotas /api/products
__tests__/
├── stores.test.js            # Testes das rotas de lojas
└── products.test.js          # Testes das rotas de produtos
```

## Variáveis de Ambiente

Copie o `.env.Staging` como referência e crie seu `.env` local:

| Variável | Descrição | Padrão |
|---|---|---|
| `PORT` | Porta da API | `3001` |
| `DB_HOST` | Host do MySQL | `localhost` |
| `DB_PORT` | Porta do MySQL | `3306` |
| `DB_NAME` | Nome do banco | `icomida` |
| `DB_USER` | Usuário do MySQL | `root` |
| `DB_PASSWORD` | Senha do MySQL | (vazio) |
| `DB_DIALECT` | Dialeto do Sequelize | `mysql` |
| `DB_LOGGING` | Habilitar logs SQL | `false` |

## Pré-requisitos

- Node.js 18+
- MySQL 8+ rodando com o banco já sincronizado (veja `packages/db`)

## Instalação

Na raiz do monorepo:

```bash
pnpm install
```

## Rodar o Servidor

```bash
# Modo desenvolvimento (com auto-reload)
pnpm --filter client run dev

# Modo produção
pnpm --filter client run start
```

O servidor inicia na porta `3001` por padrão e sincroniza as tabelas automaticamente ao iniciar.

## Rodar os Testes

```bash
pnpm --filter client run test
```

Os testes usam Jest + Supertest com mocks do banco de dados (não requerem MySQL rodando).

## Endpoints

### Health Check

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/health` | Retorna `{ status: "ok" }` |

### Stores

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/stores` | Listar todas as lojas |
| `GET` | `/api/stores/:id` | Buscar loja por ID |
| `POST` | `/api/stores` | Criar nova loja |
| `PUT` | `/api/stores/:id` | Atualizar loja |
| `DELETE` | `/api/stores/:id` | Deletar loja (requer header `x-user-id`) |

**Exemplo — criar loja:**

```bash
curl -X POST http://localhost:3001/api/stores \
  -H "Content-Type: application/json" \
  -d '{"name": "Pizza Place", "category": "PIZZA", "user_id": "uuid-do-usuario"}'
```

**Exemplo — deletar loja (com validação de dono):**

```bash
curl -X DELETE http://localhost:3001/api/stores/1 \
  -H "x-user-id: uuid-do-usuario"
```

### Products

| Método | Rota | Descrição |
|---|---|---|
| `GET` | `/api/products?store_id=X` | Listar produtos (filtro por loja) |
| `GET` | `/api/products/:id` | Buscar produto por ID |
| `POST` | `/api/products` | Criar novo produto |
| `PUT` | `/api/products/:id` | Atualizar produto |
| `DELETE` | `/api/products/:id` | Deletar produto |

**Exemplo — criar produto:**

```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -d '{"name": "Margherita", "description": "Pizza clássica", "store_id": 1, "metadata": {"price": 35.00}}'
```
