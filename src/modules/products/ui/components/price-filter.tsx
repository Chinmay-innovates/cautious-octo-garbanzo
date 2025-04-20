import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Props {
  minPrice?: string | null;
  maxPrice?: string | null;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
}
export const formatAsCurrency = (value: string) => {
  const numberValue = value.replace(/[^0-9.]/g, '');
  const parts = numberValue.split('.');
  const formattedValue = parts[0] + (parts.length > 1 ? '.' + parts[1]?.slice(0, 2) : '');
  if (!formattedValue) return '';

  const numValue = parseFloat(formattedValue);
  if (isNaN(numValue)) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(numValue);
};
export const PriceFilter = ({ minPrice, maxPrice, onMinPriceChange, onMaxPriceChange }: Props) => {
  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numberValue = e.target.value.replace(/[^0-9.]/g, '');
    onMinPriceChange(formatAsCurrency(numberValue));
  };
  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numberValue = e.target.value.replace(/[^0-9.]/g, '');
    onMaxPriceChange(formatAsCurrency(numberValue));
  };
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <Label className="font-medium text-base">Minimum price</Label>
        <Input
          type="text"
          placeholder="$0.00"
          onChange={handleMinPriceChange}
          value={minPrice ? formatAsCurrency(minPrice) : ''}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label className="font-medium text-base">Maximum price</Label>
        <Input
          type="text"
          placeholder="∞"
          onChange={handleMaxPriceChange}
          value={maxPrice ? formatAsCurrency(maxPrice) : ''}
        />
      </div>
    </div>
  );
};
