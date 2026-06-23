/**
 * Formats a numeric price to INR string with Indian locale formatting (lakhs/crores).
 *
 * @param {number} price - The price value (already in INR)
 * @returns {string} The formatted INR price string (e.g. ₹3,98,400)
 */
export function formatINR(price) {
  return `₹${Number(price).toLocaleString('en-IN')}`;
}
