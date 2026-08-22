export function formatCurrency(amount) {
  if (amount === null || amount === undefined || amount === '') {
    return formatCurrency(0)
  }

  const value = Number(amount)

  if (Number.isNaN(value)) {
    return formatCurrency(0)
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(value)
}
