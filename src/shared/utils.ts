import Decimal from "decimal.js";

export function ParsePriceToDecimal(priceStr) {
  try {
    const decimal = new Decimal(priceStr);

    // Validate max precision: 18 total digits, 8 decimal places
    const [intPart, fracPart = ''] = priceStr.split('.');
    if (intPart.length + fracPart.length > 18) {
      throw new Error('Price exceeds 18 digits of precision');
    }
    if (fracPart.length > 8) {
      throw new Error('Price has more than 8 decimal places');
    }

    // Round to 8 decimal places
    const rounded = decimal.toFixed(8);
    return new Decimal(rounded);
  } catch (err) {
    throw new Error(`Invalid price input: ${err.message}`);
  }
}