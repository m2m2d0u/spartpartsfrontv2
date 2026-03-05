export function compactFormat(value: number) {
  const formatter = new Intl.NumberFormat("en", {
    notation: "compact",
    compactDisplay: "short",
  });

  return formatter.format(value);
}

export function standardFormat(value: number) {
  return value.toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export type CurrencyFormatOptions = {
  symbol?: string;
  position?: string; // "BEFORE" | "AFTER"
  decimals?: number;
  thousandsSeparator?: string;
};

export function formatCurrency(
  value: number,
  options?: CurrencyFormatOptions,
): string {
  const symbol = options?.symbol ?? "";
  const position = options?.position ?? "AFTER";
  const decimals = options?.decimals ?? 2;
  const thousandsSep = options?.thousandsSeparator ?? " ";

  // Format with no grouping first, then insert custom separator
  const fixed = Math.abs(value).toFixed(decimals);
  const [intPart, decPart] = fixed.split(".");
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSep);
  const formatted =
    (value < 0 ? "-" : "") +
    grouped +
    (decPart !== undefined ? "," + decPart : "");

  if (!symbol) return formatted;

  return position === "BEFORE"
    ? `${symbol} ${formatted}`
    : `${formatted} ${symbol}`;
}