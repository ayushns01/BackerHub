/**
 * Utility functions for formatting data in the BackerHub app
 */

/**
 * Shortens an Ethereum address to show first 6 and last 4 characters
 * @param address - The full Ethereum address
 * @returns Shortened address like "0x1234...abcd"
 */
export function shortenAddress(address) {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Formats a number with commas for thousands separators
 * @param num - The number to format
 * @returns Formatted number string
 */
export function formatNumber(num) {
  return new Intl.NumberFormat().format(num);
}

/**
 * Formats a percentage value
 * @param value - The percentage value (0-100)
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string
 */
export function formatPercentage(value, decimals = 1) {
  return `${value.toFixed(decimals)}%`;
}