const dotenv = require('dotenv');
const mongoose = require('mongoose');

dotenv.config();
mongoose.set('sanitizeFilter', true);

const app = require('./app');

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cook-your-code';

const startServer = async () => {
  await mongoose.connect(MONGODB_URI);
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server:', error.message);
  process.exit(1);
});
