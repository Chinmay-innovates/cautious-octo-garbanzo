import { useCallback } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useCartStore } from '../store/use-cart-store';

export const useCart = (tenantSlug: string) => {
  const clearCart = useCartStore((state) => state.clearCart);
  const addProduct = useCartStore((state) => state.addProduct);
  const clearAllCart = useCartStore((state) => state.clearAllCart);
  const removeProduct = useCartStore((state) => state.removeProduct);

  const productIds = useCartStore(
    useShallow((state) => state.tenantCart[tenantSlug]?.productIds || []),
  ) as string[];

  const toggleProduct = useCallback(
    (productId: string) => {
      if (productIds.includes(productId)) {
        removeProduct(tenantSlug, productId);
      } else {
        addProduct(tenantSlug, productId);
      }
    },
    [addProduct, removeProduct, productIds, tenantSlug],
  );

  const isProductInCart = useCallback(
    (productId: string) => productIds.includes(productId),
    [productIds],
  );

  const clearTenantCart = useCallback(() => clearCart(tenantSlug), [clearCart, tenantSlug]);

  const handleAddProduct = useCallback(
    (productId: string) => addProduct(tenantSlug, productId),
    [addProduct, tenantSlug],
  );

  const handleRemoveProduct = useCallback(
    (productId: string) => removeProduct(tenantSlug, productId),
    [removeProduct, tenantSlug],
  );

  return {
    productIds,
    totalItems: productIds.length,
    addProduct: handleAddProduct,
    removeProduct: handleRemoveProduct,
    clearCart: clearTenantCart,
    clearAllCart,
    toggleProduct,
    isProductInCart,
  };
};
