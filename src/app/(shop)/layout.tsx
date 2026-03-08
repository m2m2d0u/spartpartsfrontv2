import { CartProvider } from "@/context/cart-context";
import { ShopNavbar } from "@/components/shop/shop-navbar";
import { ShopFooter } from "@/components/shop/shop-footer";
import { PortalDisabledView } from "@/components/shop/portal-disabled-view";
import { getShopCompanySettings } from "@/services/shop.server";

export default async function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let portalEnabled = true;

  try {
    const settings = await getShopCompanySettings();
    portalEnabled = settings.portalEnabled !== false;
  } catch {
    // If we can't reach the backend, allow access (graceful degradation)
  }

  if (!portalEnabled) {
    return <PortalDisabledView />;
  }

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
