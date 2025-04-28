/**
 * Generates a secure random string of specified length
 * @param length The length of the string to generate
 * @returns A secure random string
 */
export function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?'
  const array = new Uint32Array(length)
  crypto.getRandomValues(array)
  return Array.from(array, (x) => chars[x % chars.length]).join('')
} 