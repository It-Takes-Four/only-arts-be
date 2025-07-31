export class ObjectUtils {
  /**
   * Remove null and undefined values from object
   */
  static removeNullValues<T>(obj: T): Partial<T> {
    if (obj === null || obj === undefined) return {} as Partial<T>;
    
    if (Array.isArray(obj)) {
      return obj
        .filter(item => item !== null && item !== undefined)
        .map(item => this.removeNullValues(item)) as any;
    }
    
    if (typeof obj === 'object') {
      const result: any = {};
      Object.keys(obj).forEach(key => {
        const value = (obj as any)[key];
        if (value !== null && value !== undefined) {
          result[key] = this.removeNullValues(value);
        }
      });
      return result;
    }
    
    return obj;
  }

  /**
   * Deep clone object
   */
  static deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime()) as any;
    if (Array.isArray(obj)) return obj.map(item => this.deepClone(item)) as any;
    
    const cloned: any = {};
    Object.keys(obj).forEach(key => {
      cloned[key] = this.deepClone((obj as any)[key]);
    });
    
    return cloned;
  }

  /**
   * Pick specific keys from object
   */
  static pick<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
    const result = {} as Pick<T, K>;
    keys.forEach(key => {
      if (key in obj) {
        result[key] = obj[key];
      }
    });
    return result;
  }

  /**
   * Omit specific keys from object
   */
  static omit<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
    const result = { ...obj };
    keys.forEach(key => {
      delete result[key];
    });
    return result;
  }

  /**
   * Check if value is an object (not null, not array)
   */
  static isObject(value: unknown): value is Record<string, any> {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  /**
   * Check if object is empty
   */
  static isEmpty(obj: Record<string, any>): boolean {
    return Object.keys(obj).length === 0;
  }

  /**
   * Simple object merge (shallow)
   */
  static merge<T extends Record<string, any>, U extends Record<string, any>>(
    target: T, 
    source: U
  ): T & U {
    return { ...target, ...source };
  }

  /**
   * Get nested property value safely
   */
  static getNestedValue<T = any>(obj: Record<string, any>, path: string, defaultValue?: T): T | undefined {
    const keys = path.split('.');
    let current = obj;

    for (const key of keys) {
      if (current === null || current === undefined || !(key in current)) {
        return defaultValue;
      }
      current = current[key];
    }

    return current as T;
  }

  /**
   * Set nested property value safely
   */
  static setNestedValue(obj: Record<string, any>, path: string, value: any): void {
    const keys = path.split('.');
    const lastKey = keys.pop();
    
    if (!lastKey) return;

    let current = obj;
    for (const key of keys) {
      if (!(key in current) || !this.isObject(current[key])) {
        current[key] = {};
      }
      current = current[key];
    }

    current[lastKey] = value;
  }
}