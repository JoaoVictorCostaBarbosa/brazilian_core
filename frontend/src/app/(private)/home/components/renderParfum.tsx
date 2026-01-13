import ParfumBox from "./parfumBox";

interface Parfum {
  id: string;
  name: string;
  price: number;
  description: string;
  stock_quantity: number;
  url_img: string;
}

interface RenderParfumProps {
  parfum: Parfum[];
}

export default function RenderParfum({ parfum }: RenderParfumProps) {
  if (parfum.length === 0) {
    return <h1>Sem perfumes</h1>;
  }

  return (
    <div className="grid grid-cols-4 gap-3 m-3">
      {parfum.map((item) => (
        <ParfumBox key={item.id} parfum={item} />
      ))}
    </div>
  );
}
