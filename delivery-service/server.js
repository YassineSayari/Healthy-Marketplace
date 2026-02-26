require('dotenv').config();
const app = require('./app');
const connectDB = require('./src/config/db_connect');
const eurekaClient = require('./src/config/eureka_client');
const config = require('./src/config/config');

const startServer = async () => {
    try {
        await connectDB();

        const PORT = config.port || 3000;
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
