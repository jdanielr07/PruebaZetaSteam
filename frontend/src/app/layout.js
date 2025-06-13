import './globals.css';
import Navbar from '@/components/Navbar';
import { CartProvider } from '@/context/CartContext';

export const metadata = {
  title: 'ZETA Library',
  description: 'Tienda de libros',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="bg-gray-100">
        <CartProvider>
          <Navbar />
          <main className="p-4">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
