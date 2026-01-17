import { Parfum } from "../../home/components/cart/cart";
import { useCart } from "../../home/components/cart/cartContext";
import ReviewBox from "./reviewCard";

interface TesteProps {
  parfum: Parfum;
}

export default function RenderParfumPage({ parfum }: TesteProps) {
  const { addToCart } = useCart();

  return (
    <div className="mx-auto  px-4 py-10">
      <div className="mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center bg-amber-100 rounded-2xl shadow-lg p-8">
          <div className="md:col-span-1 flex justify-center">
            <img src={parfum.url_img} alt={parfum.name} className="rounded-2xl w-72 h-72 object-cover shadow-md" />
          </div>

          <div className="md:col-span-2 flex flex-col gap-4 text-teal-950">
            <h1 className="text-4xl font-extrabold tracking-tight">{parfum.name}</h1>

            <p className="text-lg text-teal-800 leading-relaxed max-w-xl">{parfum.description}</p>

            <span className="text-3xl font-bold text-emerald-900">R$ {parfum.price}</span>

            <button
              onClick={() => addToCart(parfum.id)}
              className="mt-6 inline-flex items-center gap-3 bg-emerald-900 text-amber-100 px-6 py-3 rounded-xl font-semibold text-lg shadow-md shadow-emerald-900/30 hover:bg-emerald-800 hover:scale-[1.02] active:scale-95 transition-all duration-200 max-w-fit"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-cart" viewBox="0 0 16 16">
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l1.313 7h8.17l1.313-7z" />
              </svg>
              Adicionar ao carrinho
            </button>
          </div>
        </div>
      </div>

      <div>
        <ReviewBox id={parfum.id}/>
      </div>
    </div>
  );
}
