export class DateUtils {
  /**
   * Convert date to Unix timestamp (seconds)
   */
  static toUnixTimestamp(date: Date | string | number | null | undefined): number | null {
    if (!date) return null;
    
    try {
      const dateObj = new Date(date);
      return isNaN(dateObj.getTime()) ? null : Math.floor(dateObj.getTime() / 1000);
    } catch {
      return null;
    }
  }

  /**
   * Convert Unix timestamp to Date object
   */
  static fromUnixTimestamp(timestamp: number | null | undefined): Date | null {
    if (!timestamp) return null;
    
    try {
      // Handle both seconds and milliseconds timestamps
      const ms = timestamp > 10000000000 ? timestamp : timestamp * 1000;
      return new Date(ms);
    } catch {
      return null;
    }
  }

  /**
   * Get current Unix timestamp (seconds)
   */
  static now(): number {
    return Math.floor(Date.now() / 1000);
  }

  /**
   * Calculate expiration timestamp
   */
  static calculateExpiration(expiresInSeconds: number): number {
    return Math.floor((Date.now() + (expiresInSeconds * 1000)) / 1000);
  }

  /**
   * Check if date is valid
   */
  static isValidDate(date: any): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }
}