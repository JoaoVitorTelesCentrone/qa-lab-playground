-- Conjunto didático: execute apenas em uma conexão local descartável.
-- CREATE TEMP TABLE limita os dados a esta conexão PostgreSQL.
-- Não há chaves estrangeiras intencionalmente: o treino inclui órfãos.

CREATE TEMP TABLE qa_customers (
  customer_id integer PRIMARY KEY,
  full_name text NOT NULL,
  email text
) ON COMMIT PRESERVE ROWS;

CREATE TEMP TABLE qa_products (
  product_id integer PRIMARY KEY,
  product_name text NOT NULL,
  price numeric(10, 2) NOT NULL CHECK (price >= 0),
  active boolean NOT NULL DEFAULT true
) ON COMMIT PRESERVE ROWS;

CREATE TEMP TABLE qa_orders (
  order_id integer PRIMARY KEY,
  customer_id integer NOT NULL,
  status text NOT NULL,
  total_amount numeric(10, 2) NOT NULL CHECK (total_amount >= 0),
  created_at date NOT NULL
) ON COMMIT PRESERVE ROWS;

CREATE TEMP TABLE qa_order_items (
  item_id integer PRIMARY KEY,
  order_id integer NOT NULL,
  product_id integer NOT NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price numeric(10, 2) NOT NULL CHECK (unit_price >= 0)
) ON COMMIT PRESERVE ROWS;

INSERT INTO pg_temp.qa_customers (customer_id, full_name, email) VALUES
  (1, 'Ana QA', 'ana@example.test'),
  (2, 'Bia QA', 'bia@example.test'),
  (3, 'Caio QA', 'bia@example.test'),
  (4, 'Dani QA', NULL);

INSERT INTO pg_temp.qa_products (product_id, product_name, price, active) VALUES
  (101, 'Kit de testes', 19.99, true),
  (102, 'Caderno de casos', 12.50, true),
  (103, 'Suporte de monitor', 89.00, false);

INSERT INTO pg_temp.qa_orders (order_id, customer_id, status, total_amount, created_at) VALUES
  (5001, 1, 'paid', 39.98, DATE '2026-01-12'),
  (5002, 2, 'pending', 24.00, DATE '2026-01-14'), -- total diverge dos itens (25.00)
  (5003, 99, 'paid', 99.00, DATE '2026-01-20'), -- cliente sem correspondência
  (5004, 3, 'cancelled', 19.99, DATE '2026-02-03');

INSERT INTO pg_temp.qa_order_items (item_id, order_id, product_id, quantity, unit_price) VALUES
  (1, 5001, 101, 1, 19.99),
  (2, 5001, 101, 1, 19.99),
  (3, 5002, 102, 2, 12.50),
  (4, 5999, 102, 1, 12.50), -- pedido sem correspondência
  (5, 5004, 101, 1, 19.99),
  (6, 5003, 999, 1, 99.00); -- produto sem correspondência

-- Conferência rápida: devem existir 4 clientes, 3 produtos,
-- 4 pedidos e 6 itens de pedido.
SELECT 'customers' AS table_name, COUNT(*) AS row_count FROM pg_temp.qa_customers
UNION ALL
SELECT 'products', COUNT(*) FROM pg_temp.qa_products
UNION ALL
SELECT 'orders', COUNT(*) FROM pg_temp.qa_orders
UNION ALL
SELECT 'order_items', COUNT(*) FROM pg_temp.qa_order_items;
