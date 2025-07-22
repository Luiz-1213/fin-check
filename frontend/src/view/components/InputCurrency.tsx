import { CrossCircledIcon } from '@radix-ui/react-icons';
import { NumericFormat } from 'react-number-format';
import { cn } from '../../app/utils/cn';

interface InputCurrencyProps {
  error?: string;
  value?: string | number;
  onChange?(value: string): void;
}

export function InputCurrency({ error, onChange, value }: InputCurrencyProps) {
  return (
    <div>
      <NumericFormat
        placeholder="0,00"
        thousandSeparator="."
        decimalSeparator=","
        decimalScale={2}
        fixedDecimalScale={false}
        value={value}
        onValueChange={({ value }) => {
          onChange?.(value ?? 0);
        }}
        className={cn(
          ' w-full text-gray-800 text-[32px] font-bold tracking-[-1px] outline-none',
          error && 'text-red-900'
        )}
      />

      {error && (
        <div className="flex gap-2 items-center mt-2 text-red-900">
          <CrossCircledIcon />
          <span className=" text-xs">{error}</span>
        </div>
      )}
    </div>
  );
}
