require('dotenv').config();
const app = require('./app');
const connectDB = require('./src/config/db_connect');
const eurekaClient = require('./src/config/eureka_client');
const config = require('./src/config/config');
const fetchConfig = require('./src/config/config_fetcher');

const startServer = async () => {
    try {
        const remoteConfig = await fetchConfig();
        // Merge remote config into environment variables or use it directly
        const PORT = remoteConfig['server.port'] || config.port || 3000;
        const MONGO_URI = remoteConfig['spring.data.mongodb.uri'] || config.mongoUri;
        
        process.env.MONGO_URI = MONGO_URI; // Set it for other modules
        
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            if (config.eureka.enabled === 'true' || config.eureka.enabled === true) {
                eurekaClient.start((error) => {
                    if (error) {
                        console.error('Error starting Eureka client:', error);
                    } else {
                        console.log('Eureka client started successfully');
                    }
                });
            }
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
