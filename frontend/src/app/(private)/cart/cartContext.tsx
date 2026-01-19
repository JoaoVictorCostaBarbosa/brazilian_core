"use client";

import { createContext, useContext, useState } from "react";
import { Parfum } from "./page";
import { setCartItem, removeCartItem, getCarItem } from "../../../../api/cart";
import { getProductsById } from "../../../../api/getProductById";

export interface CartItemProps extends Parfum {
  quantity: number;
}

interface CartContextProps {
  cartItems: CartItemProps[];
  addToCart: (id: string) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  getCartItems: () => Promise<CartItemProps[]>;
  getCurrCartItems: () => CartItemProps[];
}

const CartContext = createContext({} as CartContextProps);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItemProps[]>([]);

  async function addToCart(id: string) {
    try {
      const status = await setCartItem(id);
      if (status !== 201) return;

      const product = await getProductsById(id);

      setCartItems(prev => {
        const exists = prev.find(item => item.id === id);

        if (exists) {
          return prev.map(item =>
            item.id === id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }

        return [...prev, { ...product, quantity: 1 }];
      });

    } catch (error) {
      console.error("Erro ao adicionar ao carrinho:", error);
    }
  }

  function getCurrCartItems(){
    return cartItems;
  }



  async function removeFromCart(id: string) {
    try {
      const status = await removeCartItem(id);
      if (status !== 200 && status !== 204) return;

      setCartItems(prev => {
        const exists = prev.find(item => item.id === id);
        if (!exists) return prev;

        if (exists.quantity > 1) {
          return prev.map(item =>
            item.id === id
              ? { ...item, quantity: item.quantity - 1 }
              : item
          );
        }

        return prev.filter(item => item.id !== id);
      });

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


  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        getCartItems,
        getCurrCartItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
