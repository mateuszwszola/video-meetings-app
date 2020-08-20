const mongoose = require('mongoose');
const { DB_URL } = require('./');

module.exports = async (url = DB_URL, opts = {}) => {
  try {
    const connection = await mongoose.connect(url, {
      ...opts,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    return connection.connection.db;
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
