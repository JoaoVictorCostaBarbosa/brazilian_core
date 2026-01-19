import { CartItemProps, useCart  } from "./cartContext";


interface CartItemComponentProps {
    item: CartItemProps
}


export default function CartItem({ item }: CartItemComponentProps) {
  const { removeFromCart, addToCart } = useCart();

  return (
    <div className="flex items-center justify-between bg-amber-50 border border-teal-900 rounded-xl p-4 mb-3 shadow-sm hover:shadow-md transition-shadow">
      
      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-teal-900 text-amber-100 font-bold">
        {item.quantity}
      </div>

      <div className="flex-1 px-4">
        <h1 className="font-semibold text-lg text-teal-950">
          {item.name} - R${(item.price * item.quantity).toFixed(2)}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => removeFromCart(item.id)}
          className="w-9 h-9 rounded-lg bg-teal-900 text-amber-100 font-bold hover:bg-teal-800 transition-colors"
        >
          −
        </button>

        <button
          onClick={() => addToCart(item.id)}
          className="w-9 h-9 rounded-lg bg-teal-900 text-amber-100 font-bold hover:bg-teal-800 transition-colors"
        >
          +
        </button>
      </div>
    </div>
  );
}
