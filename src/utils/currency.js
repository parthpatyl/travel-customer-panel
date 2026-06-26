/**
 * Formats a numeric price to INR string with Indian locale formatting (lakhs/crores).
 *
 * @param {number} price - The price value (already in INR)
 * @returns {string} The formatted INR price string (e.g. ₹3,98,400)
 */
export function formatINR(price) {
  return `₹${Number(price).toLocaleString('en-IN')}`;
}

/**
 * Formats a numeric price to USD string with US locale formatting.
 *
 * @param {number} price - The price value (already in USD)
 * @returns {string} The formatted USD price string (e.g. $4,799.00)
 */
export function formatUSD(price) {
  if (price === null || price === undefined) return '';
  return `$${Number(price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
