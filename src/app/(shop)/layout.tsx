import { CartProvider } from "@/context/cart-context";
import { ShopNavbar } from "@/components/shop/shop-navbar";
import { ShopFooter } from "@/components/shop/shop-footer";

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col bg-gray-1 dark:bg-dark">
        <ShopNavbar />

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>

        <ShopFooter />
      </div>
    </CartProvider>
  );
}
