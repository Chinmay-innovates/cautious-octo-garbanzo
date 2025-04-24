'use client';

import { useEffect } from 'react';
import { useTRPC } from '@/trpc/client';
import { useQuery } from '@tanstack/react-query';

import { generateTenantURL } from '@/lib/utils';
import { useCustomToast } from '@/hooks/use-my-toast';
import { useCart } from '../../hooks/use-cart';
import { CheckoutItem } from '../components/checkout-item';
import { CheckoutSidebar } from '../components/checkout-sidebar';
import { EmptyState } from '@/components/empty-state';

interface Props {
  tenantSlug: string;
}

export const CheckoutView = ({ tenantSlug }: Props) => {
  const { productIds, clearCart, removeProduct } = useCart(tenantSlug);
  const trpc = useTRPC();
  const { data, error, isLoading } = useQuery(
    trpc.checkout.getProducts.queryOptions({ ids: productIds }),
  );
  const { warning } = useCustomToast();

  useEffect(() => {
    if (error?.data?.code === 'NOT_FOUND') {
      clearCart();
      warning('Invalid products found, cart cleared');
    }
  }, [error, clearCart, warning]);

  if (isLoading) {
    return (
      <div className="lg:pt-16 pt-4 px-4 lg:px-12">
        <EmptyState type="loader" />;
      </div>
    );
  }

  if (data?.totalDocs === 0) {
    return (
      <div className="lg:pt-16 pt-4 px-4 lg:px-12">
        <EmptyState />;
      </div>
    );
  }
  return (
    <div className="lg:pt-16 pt-4 px-4 lg:px-12">
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 lg:gap-17">
        <div className="lg:col-span-4">
          <div className="border rounded-md overflow-hidden bg-white">
            {data?.docs.map((product, index) => (
              <CheckoutItem
                key={product.id}
                isLast={index === data.docs.length - 1}
                imageUrl={product.image?.url}
                name={product.name}
                productUrl={`${generateTenantURL(product.tenant.slug)}/products/${product.id}`}
                tenantUrl={generateTenantURL(product.tenant.slug)}
                tenantName={product.tenant.name}
                price={product.price}
                onRemove={() => removeProduct(product.id)}
              />
            ))}
          </div>
        </div>
        <div className="lg:col-span-3">
          <CheckoutSidebar
            total={data?.totalPrice || 0}
            onCheckout={() => {}}
            isCanceled={false}
            disabled={false}
          />
        </div>
      </div>
    </div>
  );
};
