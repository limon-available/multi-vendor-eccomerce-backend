/**
 * Tiny, dependency-free request-body validator.
 *
 * Usage:
 *   router.post('/login', validate({
 *     email: { required: true, email: true },
 *     password: { required: true, type: 'string', min: 6 },
 *   }), controller.login)
 *
 * Rule options per field:
 *   required   - value must be present and non-empty
 *   type       - 'string' | 'number'  (number accepts numeric strings)
 *   email      - must look like an email address
 *   min / max  - for strings: length bounds; for numbers: value bounds
 *   trim       - trim string before validating and write the trimmed value back
 *
 * On failure responds 400 with { error, errors } and does NOT call next().
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isEmpty = (value) =>
  value === undefined || value === null || (typeof value === 'string' && value.trim() === '');

const validate = (schema) => (req, res, next) => {
  const errors = {};
  const body = req.body || {};

  for (const [field, rules] of Object.entries(schema)) {
    let value = body[field];

    if (rules.trim && typeof value === 'string') {
      value = value.trim();
      body[field] = value;
    }

    // Required check
    if (rules.required && isEmpty(value)) {
      errors[field] = `${field} is required`;
      continue;
    }

    // Skip the remaining checks for optional, absent fields
    if (isEmpty(value)) {
      continue;
    }

    // Type check
    if (rules.type === 'string' && typeof value !== 'string') {
      errors[field] = `${field} must be a string`;
      continue;
    }

    if (rules.type === 'number') {
      const num = Number(value);
      if (!Number.isFinite(num)) {
        errors[field] = `${field} must be a number`;
        continue;
      }
      if (rules.min !== undefined && num < rules.min) {
        errors[field] = `${field} must be at least ${rules.min}`;
        continue;
      }
      if (rules.max !== undefined && num > rules.max) {
        errors[field] = `${field} must be at most ${rules.max}`;
        continue;
      }
    }

    // Email check
    if (rules.email && !EMAIL_REGEX.test(String(value))) {
      errors[field] = `${field} must be a valid email`;
      continue;
    }

    // String length bounds
    if ((rules.type === 'string' || typeof value === 'string') && rules.type !== 'number') {
      const length = String(value).length;
      if (rules.min !== undefined && length < rules.min) {
        errors[field] = `${field} must be at least ${rules.min} characters`;
        continue;
      }
      if (rules.max !== undefined && length > rules.max) {
        errors[field] = `${field} must be at most ${rules.max} characters`;
        continue;
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      error: 'Validation failed',
      errors,
    });
  }

  return next();
};

module.exports = validate;
