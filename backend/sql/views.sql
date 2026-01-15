CREATE OR REPLACE VIEW vw_order_details AS
SELECT
    o.id AS order_id,
    o.user_id,
    o.coupon_id,
    o.purchase_at AS order_purchase_at,

    pr.id AS product_id,
    pr.name AS product_name,
    pr.price AS product_price,
    pr.description AS product_description,
    pr.url_img AS product_url_img,

    po.quantity AS product_quantity

FROM orders o
JOIN product_order po
    ON o.id = po.order_id
JOIN product_register pr
    ON po.product_register_id = pr.id
