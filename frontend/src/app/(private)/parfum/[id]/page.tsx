import ParfumDetailsClient from "../components/parfumDetaisClient";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return <ParfumDetailsClient productId={id} />;
}
