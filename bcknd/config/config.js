require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 5000,
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/roadmaster',
    JWT_SECRET: 'roadmaster_jwt_secret_key_2024',
    JWT_EXPIRE: process.env.JWT_EXPIRE || '24h',
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
    EMAIL_SERVICE: process.env.EMAIL_SERVICE || 'gmail',
    EMAIL_USERNAME: process.env.EMAIL_USERNAME,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
    NODE_ENV: process.env.NODE_ENV || 'development'
}; 