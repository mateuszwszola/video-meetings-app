const env = process.env.NODE_ENV || 'development';

module.exports = {
  env,
  isDev: env === 'development',
  isTest: env === 'test',
  isProd: env === 'production',
  port: process.env.PORT || 3001,
  dbUrl: process.env.DB_URL,
  corsOrigin: process.env.CORS_ORIGIN,
  jwt: {
    secret: process.env.JWT_SECRET,
    audience: process.env.JWT_AUDIENCE,
    issuer: process.env.JWT_ISSUER,
    algorithms: ['HS256'],
  },
};
