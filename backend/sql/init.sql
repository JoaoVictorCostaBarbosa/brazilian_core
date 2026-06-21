-- CREATE DATABASE IF NOT EXISTS brazilian_core;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TYPE user_role AS ENUM ('user', 'admin');

CREATE TABLE users (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'user'
);

CREATE TABLE products (
    id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price > 0),
    description TEXT NOT NULL,
    stock_quantity INTEGER NOT NULL CHECK (stock_quantity >= 0),
    url_img TEXT NOT NULL
        DEFAULT 'https://pub-fa9024cfefc44645b919b992e1a15089.r2.dev/default.jpg'
);

CREATE TABLE cart_itens (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    product_id UUID NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE (user_id, product_id)
);

CREATE TABLE coupons (
    id UUID PRIMARY KEY,
    code TEXT NOT NULL UNIQUE,
    discount_percentage INTEGER NOT NULL CHECK (discount_percentage > 0 AND discount_percentage <= 100),
    expires_at TIMESTAMP NOT NULL
);

CREATE TABLE orders (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    coupon_id UUID,
    purchase_at TIMESTAMP NOT NULL,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (coupon_id) REFERENCES coupons(id)
);

CREATE TABLE product_register (
    id UUID PRIMARY KEY,
    order_id UUID NOT NULL,
    product_id UUID NOT NULL,
    name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price > 0),
    description TEXT NOT NULL,
    url_img TEXT NOT NULL
        DEFAULT 'https://pub-fa9024cfefc44645b919b992e1a15089.r2.dev/default.jpg',

    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);


CREATE TABLE product_order (
    id UUID PRIMARY KEY,
    order_id UUID NOT NULL,
    product_register_id UUID NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),

    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_register_id) REFERENCES product_register(id)
);

CREATE TABLE review (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    product_id UUID NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE (user_id, product_id)
);

CREATE TABLE wishlist (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    product_id UUID NOT NULL,
    added_at TIMESTAMP NOT NULL,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE (user_id, product_id)
);
