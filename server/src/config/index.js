const env = process.env.NODE_ENV || 'development';

module.exports = {
  env,
  isDev: env === 'development',
  isTest: env === 'test',
  isProd: env === 'production',
  port: process.env.PORT || 3001,
  DB_URL: process.env.DB_URL,
};
