/**
 * Calculate distance between two coordinates using Haversine formula
 * @param lat1 Latitude of first point
 * @param lon1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lon2 Longitude of second point
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Radius of Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Format phone number to Armenian standard (+374XXXXXXXX)
 */
export function formatArmenianPhone(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // Handle different formats
  if (digits.startsWith('374')) {
    return '+' + digits;
  } else if (digits.startsWith('0')) {
    return '+374' + digits.substring(1);
  } else if (digits.length === 8) {
    return '+374' + digits;
  }

  return phone;
}

/**
 * Validate Armenian phone number
 */
export function isValidArmenianPhone(phone: string): boolean {
  const phoneRegex = /^\+374\d{8}$/;
  return phoneRegex.test(phone);
}

/**
 * Generate random OTP code
 */
export function generateOTP(length: number = 6): string {
  const digits = '0123456789';
  let otp = '';

  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }

  return otp;
}

/**
 * Calculate charging cost based on pricing model
 */
export function calculateChargingCost(
  energyKwh: number,
  durationMinutes: number,
  pricePerKwh: number,
  pricePerMinute: number = 0,
  startFee: number = 0
): {
  energyCost: number;
  timeCost: number;
  startFeeCost: number;
  totalCost: number;
} {
  const energyCost = energyKwh * pricePerKwh;
  const timeCost = durationMinutes * pricePerMinute;
  const startFeeCost = startFee;
  const totalCost = energyCost + timeCost + startFeeCost;

  return {
    energyCost: Math.round(energyCost * 100) / 100,
    timeCost: Math.round(timeCost * 100) / 100,
    startFeeCost: Math.round(startFeeCost * 100) / 100,
    totalCost: Math.round(totalCost * 100) / 100,
  };
}

/**
 * Delay execution for given milliseconds
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
