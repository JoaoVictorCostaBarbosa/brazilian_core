# Novas Funcionalidades — Brazilian Core

## Visão Geral

Este documento descreve as funcionalidades adicionadas ao sistema após a entrega inicial. As mudanças cobrem tanto o **backend (FastAPI + PostgreSQL)** quanto o **frontend (Next.js)**, ampliando o que usuários comuns e administradores conseguem fazer no sistema.

---

## Funcionalidades Adicionadas

### 1. Histórico de Pedidos

**O que foi adicionado:**
- `GET /api/order/` — lista todos os pedidos do usuário autenticado, com resumo (data, valor total, número de produtos e itens).
- `GET /api/order/{order_id}` — retorna os detalhes completos de um pedido, incluindo cada produto comprado, preço e quantidade.
- Página `/orders` no frontend, acessível pela sidebar em "Meus pedidos".

**Quem pode fazer:**
Qualquer usuário autenticado. Cada usuário só enxerga seus próprios pedidos — o backend rejeita com `403 Forbidden` se o `user_id` do pedido não bater com o token.

**Como altera o fluxo:**
Antes, após finalizar uma compra o usuário não tinha como consultar o que havia comprado. Agora o fluxo completo é: adicionar ao carrinho → finalizar compra → acessar "Meus pedidos" para ver o histórico com todos os detalhes.

Os dados vêm das views `vw_order_summary` e `vw_order_details` já existentes no banco, o que significa que nenhuma query nova foi necessária — apenas a exposição via endpoint.

---

### 2. Busca de Produtos por Nome

**O que foi adicionado:**
- `GET /api/products/search?name=<termo>` — busca produtos cujo nome contenha o termo informado (busca parcial, `ILIKE`, sem distinção de maiúsculas/minúsculas).
- Função `searchProducts(name)` no cliente de API do frontend (`api/products.ts`).

**Quem pode fazer:**
Qualquer usuário autenticado.

**Como altera o fluxo:**
Antes os produtos eram buscados apenas por faixa de índice (paginação numérica) ou por preço máximo. Agora é possível filtrar por nome diretamente, o que facilita encontrar um perfume específico sem percorrer toda a listagem.

---

### 3. CRUD de Produtos (Admin)

**O que foi adicionado:**

| Método | Endpoint | Ação |
|--------|----------|------|
| `POST` | `/api/products/` | Cria um novo produto |
| `PATCH` | `/api/products/{id}` | Atualiza todos os campos de um produto |
| `DELETE` | `/api/products/{id}` | Remove um produto |

- Página `/admin/products` no frontend com formulário de criação/edição e lista de produtos com botões de editar e excluir.

**Quem pode fazer:**
Exclusivamente usuários com `role = admin`. As três rotas verificam a role e retornam `403 Forbidden` para usuários comuns. O frontend redireciona para `/home` se o usuário não for admin.

**Como altera o fluxo:**
Antes o catálogo de produtos só podia ser gerenciado diretamente no banco de dados. Agora o administrador tem uma interface dedicada para cadastrar, editar e remover produtos sem precisar de acesso ao banco.

---

### 4. Validação de Cupom Expirado

**O que foi adicionado:**
Verificação do campo `expires_at` do cupom dentro do `OrderService`, antes de aplicar o desconto.

**Quem pode fazer:**
A validação é automática para qualquer usuário que tente usar um cupom durante o checkout.

**Como altera o fluxo:**
Antes, um cupom expirado seria aceito normalmente e o desconto seria aplicado indevidamente. Agora, se `expires_at < data atual`, o checkout retorna `422 Unprocessable Entity` com a mensagem "Cupom expirado" e a compra não é finalizada.

```
Checkout com cupom → buscar cupom → checar validade → [expirado] → erro 422
                                                     → [válido]  → aplicar desconto → finalizar pedido
```

---

### 5. Indicador de Estoque

**O que foi adicionado:**
Badge de estoque exibido em dois lugares:
- Card de produto na listagem (`/home`) — sobreposto na imagem.
- Página de detalhes do produto (`/parfum/[id]`) — abaixo do preço.

**Quem pode fazer:**
Visível para todos os usuários autenticados, sem ação necessária.

**Lógica do badge:**

| Condição | Exibição |
|----------|----------|
| `stock_quantity === 0` | 🔴 "Esgotado" |
| `stock_quantity <= 5` | 🟡 "Últimas X unidades" |
| `stock_quantity > 5` | 🟢 "Em estoque" |

**Como altera o fluxo:**
O campo `stock_quantity` já existia no modelo e era retornado pela API, mas não era exibido. Agora o usuário tem visibilidade do estoque antes de decidir comprar.

---

## Padrões de Projeto Utilizados

### Singleton — `DatabasePool`

O `DatabasePool` (em `backend/app/db/connection.py`) garante que exista uma única instância do pool de conexões ao banco de dados durante toda a vida da aplicação.

**Como funciona:**
A classe sobrescreve `__new__` com double-checked locking usando `threading.Lock`. Na primeira chamada, o pool é criado com no mínimo 1 e no máximo 10 conexões. Nas chamadas seguintes, a mesma instância é retornada sem abrir novas conexões.

**Impacto nas novas funcionalidades:**
Todas as operações adicionadas — busca por nome, criação/edição/remoção de produtos, listagem de pedidos — passam pelo `BaseRepository._get_cursor()`, que chama `DatabasePool().getconn()`. Como o pool é singleton, o sistema não abre múltiplos pools independentes mesmo com o aumento de endpoints.

```
Novo endpoint chama Repository → _get_cursor() → DatabasePool() [sempre mesma instância] → getconn()
```

---

### Template Method — `BaseRepository`

O `BaseRepository` (em `backend/app/repositories/base.py`) define o esqueleto de toda operação de banco de dados como um context manager:

1. Obter conexão do pool
2. Abrir cursor
3. Executar a query (passo delegado à subclasse via `yield`)
4. Commit em caso de sucesso / Rollback em caso de erro
5. Fechar cursor e devolver conexão ao pool

**Como funciona:**
O método `_get_cursor()` usa `@contextmanager`. A subclasse escreve apenas `with self._get_cursor() as (conn, cursor):` e não precisa gerenciar nenhum estado de transação.

**Impacto nas novas funcionalidades:**
Os métodos novos no `ProductRepository` (`create_product`, `update_product`, `delete_product`, `search_by_name`) herdam o padrão sem código extra. A lógica de commit/rollback/devolução ao pool já está garantida pelo template.

```python
# Exemplo: create_product usa o template sem nenhum try/finally manual
def create_product(self, product: Product) -> None:
    with self._get_cursor() as (conn, cursor):
        cursor.execute(query, (...))
    # commit, rollback e putconn acontecem automaticamente
```

---

## Resumo das Permissões

| Funcionalidade | Usuário comum | Admin |
|---|---|---|
| Ver histórico de pedidos | ✅ (somente os próprios) | ✅ |
| Buscar produtos por nome | ✅ | ✅ |
| Criar produto | ❌ | ✅ |
| Editar produto | ❌ | ✅ |
| Excluir produto | ❌ | ✅ |
| Validação de cupom expirado | automático | automático |
| Ver indicador de estoque | ✅ | ✅ |

---

## Arquivos Modificados / Criados

### Backend

| Arquivo | Tipo | Mudança |
|---|---|---|
| `app/repositories/products_repo.py` | Modificado | `create_product`, `update_product`, `delete_product`, `search_by_name` |
| `app/schemas/product_schema.py` | Modificado | `ProductRequest`, `ProductUpdateRequest` |
| `app/routers/products_route.py` | Modificado | `POST /`, `PATCH /{id}`, `DELETE /{id}`, `GET /search` |
| `app/schemas/order_schema.py` | Modificado | `OrderSummaryResponse` |
| `app/routers/order_router.py` | Modificado | `GET /`, `GET /{order_id}` |
| `app/services/order_service.py` | Modificado | Validação de `expires_at` do cupom |

### Frontend

| Arquivo | Tipo | Mudança |
|---|---|---|
| `api/order.ts` | Modificado | `getOrders()`, `getOrderById()` |
| `api/products.ts` | Criado | `searchProducts`, `createProduct`, `updateProduct`, `deleteProduct` |
| `src/app/(private)/orders/page.tsx` | Criado | Página de histórico de pedidos |
| `src/app/(private)/admin/products/page.tsx` | Criado | Painel admin de produtos |
| `src/app/(private)/home/components/parfumBox.tsx` | Modificado | Badge de estoque na listagem |
| `src/app/(private)/parfum/components/renderParfumDetailsPage.tsx` | Modificado | Indicador de estoque na página de detalhe |
| `src/app/(private)/home/components/sidebar.tsx` | Modificado | Links "Meus pedidos" e "Admin: produtos" |
