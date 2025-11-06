export function separateAmount(amount, separator = ' ') {
    if (amount === undefined || amount === null) {
        return '';
    }

    const normalized = String(amount).trim();
    if (normalized.length === 0) {
        return '';
    }

    const isNegative = normalized.startsWith('-');
    const unsignedValue = isNegative ? normalized.slice(1) : normalized;
    
    // Find the rightmost occurrence of either '.' or ',' as the decimal separator.
    // This handles various locale formats: "1,234.56" (US), "1.234,56" (EU), etc.
    const dotIndex = unsignedValue.lastIndexOf('.');
    const commaIndex = unsignedValue.lastIndexOf(',');
    const decimalIndex = Math.max(dotIndex, commaIndex);

    let fractionSymbol = '';
    let fractionDigits = '';

    if (decimalIndex !== -1 && decimalIndex < unsignedValue.length - 1) {
        fractionSymbol = unsignedValue[decimalIndex];
        fractionDigits = unsignedValue.slice(decimalIndex + 1).replace(/\D/g, '');
    }

    const integerSource = decimalIndex !== -1 ? unsignedValue.slice(0, decimalIndex) : unsignedValue;
    const integerDigitsRaw = integerSource.replace(/\D/g, '');
    const integerDigits = integerDigitsRaw.replace(/^0+(?=\d)/, '');

    if (!integerDigits && !fractionDigits) {
        return '';
    }

    const formattedInteger = (integerDigits || '0').replace(/\B(?=(\d{3})+(?!\d))/g, separator);

    if (!fractionDigits) {
        return isNegative ? `-${formattedInteger}` : formattedInteger;
    }

    const decimalSeparator = fractionSymbol === ',' ? ',' : '.';
    const formatted = `${formattedInteger}${decimalSeparator}${fractionDigits}`;
    return isNegative ? `-${formatted}` : formatted;
}

export function formatDate(date) {
    const dateFormat = new Date(date);
    const year = dateFormat.getFullYear();
    let month = String(dateFormat.getMonth() + 1).padStart(2, "0");
    let day = String(dateFormat.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}
