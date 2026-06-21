-- Migration 001: adiciona tabela wishlist
-- Aplicar manualmente em bancos já existentes:
--   psql -U <user> -d <database> -f 001_add_wishlist.sql

CREATE TABLE IF NOT EXISTS wishlist (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    product_id UUID NOT NULL,
    added_at TIMESTAMP NOT NULL,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE (user_id, product_id)
);
