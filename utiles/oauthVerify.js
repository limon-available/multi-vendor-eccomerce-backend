/**
 * Social-login token verification helpers.
 *
 * The frontend/dashboard obtain a short-lived access token from Google or
 * Facebook (client-side) and POST it to the backend. These helpers validate
 * that token directly against the provider's API and return a normalised
 * profile { provider, providerId, email, name, picture }. No extra npm
 * dependency is needed — Node's global `fetch` (Node 18+) is used.
 *
 * Throwing here means "do not trust this token"; callers translate that into a
 * 401/400 response.
 */

const { googleClientId, facebookAppId, facebookAppSecret } = require('../config/env');

const GOOGLE_TOKENINFO_URL = 'https://oauth2.googleapis.com/tokeninfo';
const GOOGLE_USERINFO_URL = 'https://www.googleapis.com/oauth2/v3/userinfo';
const FB_GRAPH_URL = 'https://graph.facebook.com';

class OAuthError extends Error {}

/**
 * Verify a Google OAuth access token (from the implicit flow used by
 * @react-oauth/google's useGoogleLogin) and return the user's profile.
 */
const verifyGoogleToken = async (accessToken) => {
  if (!accessToken || typeof accessToken !== 'string') {
    throw new OAuthError('Missing Google access token');
  }

  // tokeninfo confirms the token is valid and tells us which client/audience it
  // was issued for. When GOOGLE_CLIENT_ID is configured we enforce that the
  // token was minted for *our* app, preventing token-substitution attacks.
  const tokenInfoRes = await fetch(`${GOOGLE_TOKENINFO_URL}?access_token=${encodeURIComponent(accessToken)}`);
  if (!tokenInfoRes.ok) {
    throw new OAuthError('Invalid Google access token');
  }
  const tokenInfo = await tokenInfoRes.json();

  if (googleClientId && tokenInfo.aud && tokenInfo.aud !== googleClientId) {
    throw new OAuthError('Google token audience mismatch');
  }

  // userinfo gives us the profile fields (email/name/picture).
  const userRes = await fetch(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!userRes.ok) {
    throw new OAuthError('Unable to fetch Google profile');
  }
  const profile = await userRes.json();

  if (!profile.email) {
    throw new OAuthError('Google account has no email');
  }

  return {
    provider: 'google',
    providerId: profile.sub,
    email: String(profile.email).toLowerCase().trim(),
    name: profile.name || profile.email.split('@')[0],
    picture: profile.picture || '',
  };
};

/**
 * Verify a Facebook user access token via the Graph API and return the
 * profile. When the app secret is configured we additionally call
 * debug_token to confirm the token belongs to our Facebook app.
 */
const verifyFacebookToken = async (accessToken) => {
  if (!accessToken || typeof accessToken !== 'string') {
    throw new OAuthError('Missing Facebook access token');
  }

  if (facebookAppId && facebookAppSecret) {
    const appToken = `${facebookAppId}|${facebookAppSecret}`;
    const debugRes = await fetch(
      `${FB_GRAPH_URL}/debug_token?input_token=${encodeURIComponent(accessToken)}&access_token=${encodeURIComponent(appToken)}`,
    );
    if (!debugRes.ok) {
      throw new OAuthError('Invalid Facebook access token');
    }
    const { data } = await debugRes.json();
    if (!data || !data.is_valid || String(data.app_id) !== String(facebookAppId)) {
      throw new OAuthError('Facebook token failed validation');
    }
  }

  const fields = 'id,name,email,picture.type(large)';
  const meRes = await fetch(
    `${FB_GRAPH_URL}/me?fields=${fields}&access_token=${encodeURIComponent(accessToken)}`,
  );
  if (!meRes.ok) {
    throw new OAuthError('Unable to fetch Facebook profile');
  }
  const profile = await meRes.json();

  if (!profile.email) {
    // Facebook accounts can lack a shared email (phone-only signups). We can't
    // map those into the email-keyed user model, so reject clearly.
    throw new OAuthError('Facebook account did not share an email');
  }

  return {
    provider: 'facebook',
    providerId: profile.id,
    email: String(profile.email).toLowerCase().trim(),
    name: profile.name || profile.email.split('@')[0],
    picture: profile.picture?.data?.url || '',
  };
};

module.exports = {
  OAuthError,
  verifyGoogleToken,
  verifyFacebookToken,
};
