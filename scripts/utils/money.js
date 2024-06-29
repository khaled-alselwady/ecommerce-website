export function formatCurrency(priceCents) {
  return (Math.round(priceCents) / 100).toFixed(2); // we round price first because toFixed method sometimes has an issue (bugs) with rounding numbers.
}