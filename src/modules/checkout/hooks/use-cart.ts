import { useCartStore } from '../store/use-cart-store';

export const useCart = (tenantSlug: string) => {
  const { addProduct, clearAllCart, clearCart, getCartByTenant, removeProduct } = useCartStore();

  const productIds = getCartByTenant(tenantSlug);

  const toggleProduct = (productId: string) => {
    if (productIds.includes(productId)) {
      removeProduct(tenantSlug, productId);
    } else {
      addProduct(tenantSlug, productId);
    }
  };

  const isProductInCart = (productId: string) => productIds.includes(productId);

  const clearTenantCart = () => clearCart(tenantSlug);

  return {
    productIds,
    totalItems: productIds.length,
    addProduct: (productId: string) => addProduct(tenantSlug, productId),
    removeProduct: (productId: string) => removeProduct(tenantSlug, productId),
    clearCart: clearTenantCart,
    clearAllCart,
    toggleProduct,
    isProductInCart,
  };
};
