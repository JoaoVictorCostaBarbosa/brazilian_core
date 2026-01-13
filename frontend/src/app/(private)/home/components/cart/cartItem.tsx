import { CartItemProps, useCart  } from "./cartContext";


interface CartItemComponentProps {
    item: CartItemProps
}


export default function CartItem({item}: CartItemComponentProps){
    const {removeFromCart, addToCart} = useCart();

    return(
        <div className="p-2 bg-amber-100 border-2 border-teal-900 grid grid-cols-8 rounded-lg flex-row mb-2 gap-1">
            <div className="flex justify-center items-center col-span-1">
                {item.quantity}
            </div>
            <div className="col-span-5 items-center flex">
                <h1 className="font-bold">{item.name}</h1>
            </div>
            <div className="col-span-1 items-center flex">
                <button onClick={() => {removeFromCart(item.id)}}>-</button>
            </div>
            <div className="col-span-1 items-center flex">
                <button onClick={() => {addToCart(item.id)}}>+</button>
            </div>
        </div>
    )
}