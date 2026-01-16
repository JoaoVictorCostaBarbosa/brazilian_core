-- users

INSERT INTO users (id, name, email, password, role)
VALUES
(
    gen_random_uuid(),
    'Admin',
    'admin@email.com',
    '$argon2id$v=19$m=65536,t=3,p=4$FoOC27r4vHmPfoAYIempgg$JqgJQ4lb5HN6qQw6gsLw5/fI8EYLN8YxZE50iAxeElI',
    'admin'
),
(
    gen_random_uuid(),
    'string',
    'string',
    '$argon2id$v=19$m=65536,t=3,p=4$vFz+RCszqdnSaudPCzrbeg$PLXBccvxsoe3nCAKxAj1EnDbohUv/yZowKP4DN8wUpA',
    'user'
)
;

-- products

INSERT INTO products (id, name, price, description, stock_quantity) VALUES
(uuid_generate_v4(), 'Dior Sauvage', 449.90, 'Perfume com 100ml', 30),
(uuid_generate_v4(), 'Bleu de Chanel', 469.90, 'Perfume com 100ml', 25),
(uuid_generate_v4(), 'Acqua di Gio', 399.90, 'Perfume com 100ml', 40),
(uuid_generate_v4(), 'Invictus', 379.90, 'Perfume com 100ml', 22),
(uuid_generate_v4(), '1 Million', 429.90, 'Perfume com 100ml', 18),
(uuid_generate_v4(), 'Armani Code', 389.90, 'Perfume com 75ml', 15),
(uuid_generate_v4(), '212 VIP Men', 359.90, 'Perfume com 100ml', 35),
(uuid_generate_v4(), 'Versace Eros', 419.90, 'Perfume com 100ml', 28),
(uuid_generate_v4(), 'The One D&G', 389.90, 'Perfume com 100ml', 20),
(uuid_generate_v4(), 'Y Yves Saint Laurent', 459.90, 'Perfume com 100ml', 17),
(uuid_generate_v4(), 'La Nuit de L Homme', 439.90, 'Perfume com 100ml', 14),
(uuid_generate_v4(), 'Boss Bottled', 349.90, 'Perfume com 100ml', 45),
(uuid_generate_v4(), 'Le Male JPG', 399.90, 'Perfume com 125ml', 19),
(uuid_generate_v4(), 'Fahrenheit Dior', 379.90, 'Perfume com 100ml', 13),
(uuid_generate_v4(), 'CK One', 299.90, 'Perfume com 200ml', 50),
(uuid_generate_v4(), 'Polo Blue', 369.90, 'Perfume com 125ml', 27),
(uuid_generate_v4(), 'Givenchy Gentleman', 409.90, 'Perfume com 100ml', 16),
(uuid_generate_v4(), 'Montblanc Explorer', 389.90, 'Perfume com 100ml', 33),
(uuid_generate_v4(), 'Azzaro Wanted', 359.90, 'Perfume com 100ml', 29),
(uuid_generate_v4(), 'Spicebomb', 429.90, 'Perfume com 90ml', 21),
(uuid_generate_v4(), 'Ultra Male', 419.90, 'Perfume com 125ml', 24),
(uuid_generate_v4(), 'Light Blue Pour Homme', 349.90, 'Perfume com 125ml', 26),
(uuid_generate_v4(), 'Nautica Voyage', 219.90, 'Perfume com 100ml', 60),
(uuid_generate_v4(), 'Lacoste Blanc', 329.90, 'Perfume com 100ml', 31),
(uuid_generate_v4(), 'Bentley Intense', 299.90, 'Perfume com 100ml', 18),
(uuid_generate_v4(), 'Hugo Man', 319.90, 'Perfume com 125ml', 34),
(uuid_generate_v4(), 'Burberry Hero', 399.90, 'Perfume com 100ml', 20),
(uuid_generate_v4(), 'Prada L Homme', 449.90, 'Perfume com 100ml', 15),
(uuid_generate_v4(), 'Prada Luna Rossa', 389.90, 'Perfume com 100ml', 23),
(uuid_generate_v4(), 'CH Men', 379.90, 'Perfume com 100ml', 17),
(uuid_generate_v4(), 'Issey Miyake', 339.90, 'Perfume com 125ml', 28),
(uuid_generate_v4(), 'Cool Water', 289.90, 'Perfume com 125ml', 42),
(uuid_generate_v4(), 'Ferrari Black', 199.90, 'Perfume com 125ml', 55),
(uuid_generate_v4(), 'Diesel Only The Brave', 349.90, 'Perfume com 125ml', 25),
(uuid_generate_v4(), 'Afnan 9PM', 259.90, 'Perfume com 100ml', 38),
(uuid_generate_v4(), 'Lattafa Asad', 249.90, 'Perfume com 100ml', 44),
(uuid_generate_v4(), 'Ralph Lauren Polo Green', 389.90, 'Perfume com 118ml', 19),
(uuid_generate_v4(), 'Armaf Club de Nuit Intense', 299.90, 'Perfume com 105ml', 47),
(uuid_generate_v4(), 'Jean Paul Gaultier Scandal', 429.90, 'Perfume com 100ml', 14),
(uuid_generate_v4(), 'Azzaro Chrome', 329.90, 'Perfume com 100ml', 36),
(uuid_generate_v4(), 'Eternity Calvin Klein', 319.90, 'Perfume com 100ml', 32),
(uuid_generate_v4(), 'Bvlgari Man In Black', 449.90, 'Perfume com 100ml', 16),
(uuid_generate_v4(), 'Bvlgari Aqva', 389.90, 'Perfume com 100ml', 22),
(uuid_generate_v4(), 'Kenzo Homme', 359.90, 'Perfume com 110ml', 27),
(uuid_generate_v4(), 'Salvatore Ferragamo Uomo', 379.90, 'Perfume com 100ml', 18),
(uuid_generate_v4(), 'Joop Homme', 299.90, 'Perfume com 125ml', 41),
(uuid_generate_v4(), 'Carolina Herrera Bad Boy', 419.90, 'Perfume com 100ml', 20),
(uuid_generate_v4(), 'Mercedes Benz Club', 329.90, 'Perfume com 100ml', 35),
(uuid_generate_v4(), 'Jimmy Choo Man', 349.90, 'Perfume com 100ml', 29),
(uuid_generate_v4(), 'Halloween Man X', 289.90, 'Perfume com 100ml', 37);
