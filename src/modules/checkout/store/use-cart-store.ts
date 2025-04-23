import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface TenantCart {
  productIds: string[];
}

interface CartStore {
  tenantCart: Record<string, TenantCart>;
  addProduct: (tenantSlug: string, productId: string) => void;
  removeProduct: (tenantSlug: string, productId: string) => void;
  clearCart: (tenantSlug: string) => void;
  clearAllCart: () => void;
  getCartByTenant: (tenantSlug: string) => string[];
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      tenantCart: {},
      addProduct: (tenantSlug, productId) =>
        set((state) => ({
          tenantCart: {
            ...state.tenantCart,
            [tenantSlug]: {
              productIds: [...(state.tenantCart[tenantSlug]?.productIds || []), productId],
            },
          },
        })),
      removeProduct: (tenantSlug, productId) =>
        set((state) => ({
          tenantCart: {
            ...state.tenantCart,
            [tenantSlug]: {
              productIds:
                state.tenantCart.tenantSlug?.productIds?.filter((id) => id !== productId) || [],
            },
          },
        })),
      clearCart: (tenantSlug) =>
        set((state) => ({
          tenantCart: {
            ...state.tenantCart,
            [tenantSlug]: {
              productIds: [],
            },
          },
        })),
      clearAllCart: () =>
        set({
          tenantCart: {},
        }),
      getCartByTenant: (tenantSlug) => get().tenantCart[tenantSlug]?.productIds || [],
    }),
    {
      name: 'funroad-cart',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
