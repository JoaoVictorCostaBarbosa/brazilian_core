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
