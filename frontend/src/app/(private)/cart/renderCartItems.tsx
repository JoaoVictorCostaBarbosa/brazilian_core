import CartItem from "./cartItem";
import { CartItemProps } from "./cartContext";

interface RenderCartItemsProps {
  cartItems: CartItemProps[];
}

export default function RenderCartItems({ cartItems }: RenderCartItemsProps) {
  if (cartItems.length === 0) {
    return <h1 className="font-bold text-teal-950">Sem perfumes</h1>;
  }

  return (
    <div className="text-teal-950 bg-amber-100 ">
      {cartItems.map(item => (
        <CartItem key={item.id} item={item} />
      ))}
    </div>
  );
}


