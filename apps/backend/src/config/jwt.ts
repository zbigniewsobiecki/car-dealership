import { env } from './env.js';

export const jwtConfig = {
  secret: env.jwt.secret,
  expiresIn: env.jwt.expiresIn,
  refreshSecret: env.jwt.refreshSecret,
  refreshExpiresIn: env.jwt.refreshExpiresIn,
};
