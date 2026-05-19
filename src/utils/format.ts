/**
 * Format a number as Philippine Peso (PHP)
 * Example: formatPrice(1000) => "₱1,000"
 * Example: formatPrice(1250.5) => "₱1,250.50"
 */
export function formatPrice(price: number): string {
  return `₱${price.toLocaleString('en-PH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Format a number with commas only (no currency symbol)
 * Example: formatNumber(1000) => "1,000"
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('en-PH');
}
