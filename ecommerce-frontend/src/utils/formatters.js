// Prices in the mock data / API contract are stored as integers
// (e.g. 24900 == ₹249.00) to avoid floating point issues, mirroring
// how many backends store money as minor-unit integers (cents/paise).

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
})

/** Formats an integer minor-unit price (e.g. 24900) as a display string. */
export function formatPrice(amount) {
  return currencyFormatter.format(amount / 100)
}

export function formatRating(rating) {
  return rating.toFixed(1)
}

export function calculateDiscountPercent(price, originalPrice) {
  if (!originalPrice || originalPrice <= price) return null
  return Math.round(((originalPrice - price) / originalPrice) * 100)
}

export function pluralize(count, singular, plural = `${singular}s`) {
  return count === 1 ? singular : plural
}
