"use client";

import { createContext, useContext, useState } from "react";
import { Parfum } from "./cart";
import { setCartItem, removeCartItem, getCarItem } from "../../../../../../api/cart";
import { getProductsById } from "../../../../../../api/getProductsByPrice";

export interface CartItemProps extends Parfum {
  quantity: number;
}

interface CartContextProps {
  cartItems: CartItemProps[];
  addToCart: (id: string) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  getCartItems: () => Promise<CartItemProps[]>;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext({} as CartContextProps);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItemProps[]>([]);

  async function addToCart(id: string) {
  try {
    const status = await setCartItem(id);

    if (status !== 201) return;

    setCartItems(prev => {
      const itemExists = prev.find(item => item.id === id);

      if (itemExists) {
        return prev.map(item =>
          item.id === id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return prev; 
    });

    const product = await getProductsById(id);

    setCartItems(prev => [
      ...prev,
      { ...product, quantity: 1 }
    ]);

  } catch (error) {
    console.error("Erro ao adicionar ao carrinho:", error);
  }
}


  async function removeFromCart(id: string) {
    try {
      await removeCartItem(id);
      
    } catch (error) {
      console.error("Erro ao remover item do carrinho:", error);
    }
  }

  async function getCartItems() {
    try {
      const items = await getCarItem();
      setCartItems(items);
      return cartItems
    } catch (error) {
      console.error("Erro ao buscar itens do carrinho:", error);
      throw error;
    }
  }

  function clearCart() {
    setCartItems([]);
  }

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        getCartItems,
        clearCart,
        total
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
