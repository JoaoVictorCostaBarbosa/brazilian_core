import "./globals.css";
import { CartProvider } from "./(private)/home/components/cart/cartContext";
import { UserProvider } from "./(private)/user/context/userContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
   return (
    <html lang="pt-br">
      <body>
        <CartProvider>
        <UserProvider>
          {children}
        </UserProvider>
        </CartProvider>
      </body>
    </html>
  );
}
