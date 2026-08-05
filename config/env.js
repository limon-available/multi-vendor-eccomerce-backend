const DEFAULT_CLIENT_ORIGINS = [
  'https://multi-vendor-dashboard-ecommerce.vercel.app',
  'https://frontend-mern-multi-vendor-ecommerc.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001',
];

const parseList = (value) => {
  if (!value) {
    return [];
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
};

const isProduction = process.env.NODE_ENV === 'production' || process.env.mode === 'pro';
const clientOrigins = [...new Set([...parseList(process.env.CLIENT_ORIGINS), ...DEFAULT_CLIENT_ORIGINS])];
const dashboardUrl = (process.env.DASHBOARD_URL || (isProduction ? 'https://multi-vendor-dashboard-ecommerce.vercel.app' : 'http://localhost:3001')).replace(/\/+$/, '');
const port = Number(process.env.PORT) || 5000;
const mongoUrl = process.env.mode === 'pro' ? process.env.DB_PRO_URL : process.env.DB_LOCAL_URL;

// Social login (Google / Facebook). Optional — when unset the related sign-in
// buttons won't work, but the server still boots normally (not in requiredEnv).
const googleClientId = process.env.GOOGLE_CLIENT_ID || '';
const facebookAppId = process.env.FACEBOOK_APP_ID || '';
const facebookAppSecret = process.env.FACEBOOK_APP_SECRET || '';

const requiredEnv = ['SECRET', 'cloud_name', 'api_key', 'api_secret', 'STRIPE_SECRET_KEY'];

const validateEnv = () => {
  const missing = requiredEnv.filter((key) => !process.env[key]);

  if (!mongoUrl) {
    missing.push(process.env.mode === 'pro' ? 'DB_PRO_URL' : 'DB_LOCAL_URL');
  }

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

module.exports = {
  clientOrigins,
  dashboardUrl,
  isProduction,
  mongoUrl,
  port,
  googleClientId,
  facebookAppId,
  facebookAppSecret,
  validateEnv,
};
