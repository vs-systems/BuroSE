/**
 * Calculates the verification digit for a CUIT/CUIL in Argentina.
 * @param {string} cuitBase - The first 10 digits (prefix + DNI).
 * @returns {number} The verification digit.
 */
export const calculateCUITDigit = (cuitBase) => {
    const multipliers = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
    let sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cuitBase[i]) * multipliers[i];
    }
    const remainder = sum % 11;
    if (remainder === 0) return 0;
    if (remainder === 1) return 9;
    return 11 - remainder;
};

export const getDeviceFingerprint = () => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');
    const debugInfo = gl ? gl.getExtension('WEBGL_debug_renderer_info') : null;
    const components = [
        navigator.userAgent,
        navigator.language,
        screen.colorDepth,
        screen.width + 'x' + screen.height,
        new Date().getTimezoneOffset(),
        debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'no-gl'
    ];
    return btoa(components.join('|')).substring(0, 32);
};

/**
 * Formats a CUIT string as XX-XXXXXXXX-X
 * @param {string} cuit - 11 digits
 * @returns {string} Formatted CUIT
 */
export const formatCUIT = (cuit) => {
    const digits = cuit.replace(/\D/g, '');
    if (digits.length !== 11) return digits;
    return `${digits.slice(0, 2)}-${digits.slice(2, 10)}-${digits.slice(10)}`;
};
