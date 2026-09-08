export const success = (data) => ({ success: true, data });
export const failure = (message, errors = []) => ({ success: false, message, ...(errors.length ? { errors } : {}) });
