/**
 * Formats a USD base price to INR using an approximate exchange rate of 1 USD = 83 INR.
 * Uses Indian locale formatting (en-IN) for standard comma grouping (lakhs/crores).
 * 
 * @param {number} usdPrice - The price in USD
 * @returns {string} The formatted INR price string (e.g. ₹3,98,400)
 */
export function formatINR(usdPrice) {
  const inrPrice = usdPrice * 83;
  return `₹${inrPrice.toLocaleString('en-IN')}`;
}
