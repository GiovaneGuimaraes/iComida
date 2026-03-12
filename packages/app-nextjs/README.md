# app-nextjs — Aplicação Web iComida

Aplicação Next.js 16 com React 19 que consome a REST API (`packages/client`) para gerenciamento de lojas e produtos.

## Estrutura

```
api/
├── client.ts          # Cliente Supabase (auth + storage)
└── restClient.ts      # Cliente HTTP para a REST API
hooks/
├── useAuth.tsx        # Hook de autenticação (Supabase Auth)
├── useStores.tsx      # Hook de lojas (consome REST API)
└── useProducts.tsx    # Hook de produtos (consome REST API)
app/
├── page.tsx           # Página inicial (listagem de lojas)
├── login/             # Login
├── register/          # Cadastro
├── admin/my-stores/   # Painel admin (CRUD lojas e produtos)
├── components/ui/     # Componentes reutilizáveis
└── provider/          # Providers (Chakra UI, Auth, Theme)
```

## Variáveis de Ambiente

Copie o `.env.Staging` como referência e crie seu `.env.local`:

| Variável | Descrição |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anônima do Supabase |
| `NEXT_PUBLIC_API_URL` | URL base da REST API (ex: `http://localhost:3001/api`) |

## Pré-requisitos

- Node.js 18+
- A REST API (`packages/client`) rodando em `http://localhost:3001`
- Projeto Supabase configurado (para auth e upload de imagens)

## Instalação

Na raiz do monorepo:

```bash
pnpm install
```

## Rodar em Desenvolvimento

```bash
pnpm --filter app run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Build de Produção

```bash
pnpm --filter app run build
pnpm --filter app run start
```

## Lint

```bash
pnpm --filter app run lint
```

## Arquitetura

A aplicação usa uma separação em camadas:

1. **Supabase** — Autenticação (login/registro) e upload de imagens (Storage)
2. **REST API** — CRUD de lojas e produtos via `api/restClient.ts`
3. **Hooks** — `useStores` e `useProducts` consomem a API e gerenciam estado local
4. **Componentes** — UI com Chakra UI + Tailwind CSS
