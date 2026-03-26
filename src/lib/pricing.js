export function calculateCr(distanceKm) {
  if (distanceKm <= 2) return 2
  if (distanceKm <= 4) return 3
  if (distanceKm <= 5) return 4
  if (distanceKm <= 10) return 5

  const extra = Math.ceil((distanceKm - 10) / 5)
  return 5 + extra
}
