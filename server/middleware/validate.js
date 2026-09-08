export function validateRequest(schema) {
  return (req, res, next) => {
    const result = schema(req);
    if (result.errors?.length) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: result.errors });
    }
    return next();
  };
}
