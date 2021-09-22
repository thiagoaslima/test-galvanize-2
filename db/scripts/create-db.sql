CREATE TABLE IF NOT EXISTS products (
  id serial PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price decimal NOT NULL
);

CREATE TABLE IF NOT EXISTS test (
  id serial PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price decimal NOT NULL
);

INSERT INTO products(id, name, price) VALUES
  (1, 'Product A', '1.00'),
  (2, 'Product B', '0.20'),
  (3, 'Product C', '99.99');
