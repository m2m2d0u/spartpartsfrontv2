"use client";

type QuantitySelectorProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max: number;
  disabled?: boolean;
};

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max,
  disabled = false,
}: QuantitySelectorProps) {
  function handleDecrement() {
    if (value > min) onChange(value - 1);
  }

  function handleIncrement() {
    if (value < max) onChange(value + 1);
  }

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    const num = parseInt(e.target.value, 10);
    if (!isNaN(num)) {
      onChange(Math.max(min, Math.min(num, max)));
    }
  }

  return (
    <div className="inline-flex items-center rounded-lg border border-stroke dark:border-dark-3">
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        className="flex h-10 w-10 items-center justify-center text-dark transition hover:bg-gray-2 disabled:cursor-not-allowed disabled:opacity-50 dark:text-white dark:hover:bg-dark-3"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M3 8h10" />
        </svg>
      </button>

      <input
        type="number"
        value={value}
        onChange={handleInput}
        disabled={disabled}
        min={min}
        max={max}
        className="h-10 w-14 border-x border-stroke bg-transparent text-center text-sm font-medium text-dark outline-none disabled:cursor-not-allowed dark:border-dark-3 dark:text-white [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />

      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || value >= max}
        className="flex h-10 w-10 items-center justify-center text-dark transition hover:bg-gray-2 disabled:cursor-not-allowed disabled:opacity-50 dark:text-white dark:hover:bg-dark-3"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M8 3v10M3 8h10" />
        </svg>
      </button>
    </div>
  );
}
