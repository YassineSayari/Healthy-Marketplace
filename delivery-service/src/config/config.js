require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3000,
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/delivery_db',
    eureka: {
        host: process.env.EUREKA_HOST || 'localhost',
        port: process.env.EUREKA_PORT || 8761,
        servicePath: process.env.EUREKA_SERVICE_PATH || '/eureka/apps/',
        enabled: process.env.EUREKA_ENABLED || 'true'
    }
};
