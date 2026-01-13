-- Trigger para INSERT:
-- Se já existir (user_id, product_id), soma a quantidade ao invés de criar outra linha
CREATE OR REPLACE FUNCTION cart_itens_upsert_quantity()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM cart_itens
    WHERE user_id = NEW.user_id
      AND product_id = NEW.product_id
  ) THEN
    UPDATE cart_itens
    SET quantity = quantity + NEW.quantity
    WHERE user_id = NEW.user_id
      AND product_id = NEW.product_id;

    RETURN NULL;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_cart_itens_upsert ON cart_itens;

CREATE TRIGGER trg_cart_itens_upsert
BEFORE INSERT ON cart_itens
FOR EACH ROW
EXECUTE FUNCTION cart_itens_upsert_quantity();


-- Trigger para DELETE:
-- Se quantity > 1, apenas decrementa
-- Se quantity = 1, deixa deletar a linha
CREATE OR REPLACE FUNCTION cart_itens_decrement_or_delete()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.quantity > 1 THEN
    UPDATE cart_itens
    SET quantity = quantity - 1
    WHERE id = OLD.id;

    RETURN NULL;
  END IF;

  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_cart_itens_decrement ON cart_itens;

CREATE TRIGGER trg_cart_itens_decrement
BEFORE DELETE ON cart_itens
FOR EACH ROW
EXECUTE FUNCTION cart_itens_decrement_or_delete();


-- Trigger para INSERT em product_order:
-- Ao criar um item de pedido, diminui o estoque do produto original

CREATE OR REPLACE FUNCTION decrease_product_stock()
RETURNS TRIGGER AS $$
DECLARE
    v_product_id UUID;
BEGIN
    SELECT product_id
    INTO v_product_id
    FROM product_register
    WHERE id = NEW.product_register_id;

    UPDATE products
    SET stock_quantity = stock_quantity - NEW.quantity
    WHERE id = v_product_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Produto não encontrado para o product_register %', NEW.product_register_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_decrease_product_stock ON product_order;

CREATE TRIGGER trg_decrease_product_stock
AFTER INSERT ON product_order
FOR EACH ROW
EXECUTE FUNCTION decrease_product_stock();
